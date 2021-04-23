import { Stores, Interfaces } from '@nti/lib-store';
import { Iterable } from '@nti/lib-commons';
import { getService } from '@nti/web-client';

import batchGenerator from './utils/batch-generator';
import combineGroups from './utils/combine-groups';
import getSemester from './utils/get-semester';

async function resolveCollection(collection) {
	if (typeof collection !== 'string') {
		return collection;
	}

	const service = await getService();

	return service.getCollection(collection, 'Courses');
}

const Generators = [
	{
		handles: (collection, params) =>
			params.sortOn === 'availability' && !params.filter,
		generator: async function* (collection, params) {
			const fixedParams = {
				...params,
				sortOn: 'startDate',
				sortDirection: null,
			};
			const iterator = Iterable.chain.async(
				batchGenerator(collection, { ...fixedParams, rel: 'upcoming' }),
				batchGenerator(collection, { ...fixedParams, rel: 'current' }),
				batchGenerator(
					collection,
					{ ...fixedParams, rel: 'archived' },
					getSemester
				)
			);

			yield* iterator;
		},
	},
	{
		handles: () => true,
		generator: batchGenerator,
	},
];

class CourseCollectionStore extends Stores.BoundStore {
	bindingDidUpdate(prevBinding) {
		return (
			prevBinding.collection !== this.binding.collection ||
			prevBinding.sortOn !== this.binding.sortOn ||
			prevBinding.sortDirection !== this.binding.sortDirection ||
			prevBinding.filter !== this.binding.filter
		);
	}

	applySearchTerm(term) {
		if ((term ?? '') !== (this.lastSearchTerm ?? '')) {
			this.setImmediate({
				loading: true,
				groups: null,
			});
		}
	}

	getParams() {
		const params = {
			sortOn: this.binding.sortOn,
			sortDirection: this.binding.sortDirection,
			batchSize: this.binding.batchSize,
		};

		if (this.searchTerm) {
			params.filter = this.searchTerm;
		}

		return params;
	}

	isCurrentParams(params) {
		const current = this.getParams();

		return (
			current.sortOn === params.sortOn &&
			current.sortDirection === params.sortDirection &&
			current.batchSize === params.batchSize &&
			current.filter === params.filter
		);
	}

	clearGenerator() {
		delete this.generator;
	}

	async load() {
		if (this.lastParams && this.isCurrentParams(this.lastParams)) {
			return;
		}

		this.setImmediate({
			loading: true,
			error: null,
			groups: null,
			hasMore: false,
		});

		this.clearGenerator();

		const collection = (this.collection = await resolveCollection(
			this.binding.collection
		));
		const params = (this.lastParams = this.getParams());

		if (!collection) {
			this.set({
				groups: [{ name: 'empty', Items: [] }],
				hasMore: false,
				loading: false,
			});

			return;
		}

		try {
			const handler = Generators.find(g =>
				g.handles?.(collection, params)
			);
			this.generator = handler?.generator(collection, params);

			if (!this.generator) {
				throw new Error('Unknown sort');
			}

			const initialGroups = await this.generator.next();

			//if the params have changed we don't want to set these results
			if (!this.isCurrentParams(params)) {
				return;
			}

			this.setImmediate({
				collection,
				loading: false,
				groups: initialGroups.value,
				hasMore: !initialGroups.done,
			});
		} catch (e) {
			if (!this.isCurrentParams(params)) {
				return;
			}

			this.set({
				loading: false,
				error: e,
			});
		}
	}

	async loadMore() {
		const { generator } = this;

		if (!generator || this.get('loading')) {
			return;
		}

		this.setImmediate({
			loading: true,
		});

		const current = this.get('groups');
		const next = await generator.next();

		if (this.generator !== generator) {
			return;
		}

		this.set({
			loading: false,
			groups: next.value ? combineGroups(current, next.value) : current,
			hasMore: !next.done,
		});
	}

	onCourseDelete(course) {
		this.setImmediate({
			groups: (this.get('groups') ?? []).map(group => {
				return {
					...group,
					Items: (group.Items ?? []).filter(c => c !== course),
				};
			}),
		});
	}
}

export const Store = Interfaces.Searchable(CourseCollectionStore);
