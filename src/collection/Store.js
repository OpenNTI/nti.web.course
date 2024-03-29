import { Stores, Interfaces } from '@nti/lib-store';
import { Iterable } from '@nti/lib-commons';
import { getService } from '@nti/web-client';
import Logger from '@nti/util-logger';

import { batchGenerator } from './utils/batch-generator';
import combineGroups from './utils/combine-groups';
import getSemester from './utils/get-semester';

const logger = Logger.get('source:collection:store');

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
			params.sortOn === 'favorites' &&
			collection.hasLink('Favorites') &&
			!params.filter,
		generator: async function* (collection, params) {
			const service = await getService();
			const batch = await service.getBatch(
				collection.getLink('Favorites')
			);

			yield [
				{
					name: 'Favorites',
					Items: batch.Items,
					Total: batch.Total,
					batchDone: true,
				},
			];
		},
	},
	{
		handles: (collection, params) =>
			params.sortOn === 'availability' && !params.filter,
		generator: async function* (collection, params) {
			const iterator = Iterable.chain.async(
				batchGenerator(collection, { rel: 'upcoming' }),
				batchGenerator(collection, { rel: 'current' }),
				batchGenerator(collection, { rel: 'archived' }, getSemester)
			);

			yield* iterator;
		},
	},
	{
		handles: () => true,
		generator: batchGenerator,
	},
];

const descendingSorts = [
	'favorites',
	'availability',
	'createdTime',
	'lastSeenTime',
];

class CourseCollectionStore extends Stores.BoundStore {
	constructor() {
		super();

		let abort;
		this.unsubscribeEnrollment = () => void (abort = true);

		(async () => {
			// listen for course drop events
			const enrollmentService = (await getService()).getEnrollment();
			if (abort) {
				logger.warn('Got unsubscribe call before adding the listener?');
				return;
			}
			enrollmentService.addListener('afterdrop', this.#onAfterCourseDrop);
			this.unsubscribeEnrollment = () =>
				enrollmentService.removeListener(
					'afterdrop',
					this.#onAfterCourseDrop
				);
		})();
	}

	static defaultSortOrder = sortOn =>
		descendingSorts.includes(sortOn) ? 'descending' : 'ascending';

	#onAfterCourseDrop = ({ course, error }) => {
		if (!error) {
			this.#removeCourse(course);
		}
	};

	async cleanup() {
		this.unsubscribeEnrollment();
	}

	bindingDidUpdate(prevBinding) {
		return (
			prevBinding.collection !== this.binding.collection ||
			prevBinding.sortOn !== this.binding.sortOn ||
			prevBinding.sortOrder !== this.binding.sortOrder ||
			prevBinding.filter !== this.binding.filter ||
			prevBinding.course_filter !== this.binding.course_filter
		);
	}

	applySearchTerm(term) {
		if ((term ?? '') !== (this.lastSearchTerm ?? '')) {
			delete this.lastParams;
			this.setImmediate({
				loading: true,
				groups: null,
			});
		}
	}

	getParams() {
		const params = {
			sortOn: this.binding.sortOn,
			sortOrder: this.binding.sortOrder,
			batchSize: this.binding.batchSize,
			course_filter: this.binding.course_filter,
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
			current.sortOrder === params.sortOrder &&
			current.batchSize === params.batchSize &&
			current.filter === params.filter &&
			current.course_filter === params.course_filter
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

		/*
		For a generator using chained iterators internally like we do for fetching 'current' courses
		followed by 'administered' courses the following scenario may arise:

		- We've exhausted the 'current courses' iterator

		- The generator isn't 'done' because it still has the 'administered courses' iterator to consume

		- We show a 'Load More' button in the UI accordingly

		- The user has no administered courses so the 'Load More' button doesn't appear to do anything,
		  leaving the impression that it was displayed erroneously.

		To remedy this: The batch-generator returns a batchDone field, indicating that the current
		  iterator is done (independently of whether the generator is done.) If the iterator is done
		  but the generator isn't we'll call next again.
		*/
		const getNext = async (
			current = this.get('groups'),
			currentDepth = 0 // cutoff to prevent infinite recursion (just in case)
		) => {
			const { value, done } = await generator.next();
			const groups = value ? combineGroups(current, value) : current;

			const groupDone =
				Array.isArray(value) &&
				(value[value.length - 1]?.batchDone ?? true);

			// current group is done but the generator isn't
			if (
				generator === this.generator &&
				groupDone &&
				!done &&
				currentDepth <= 5
			) {
				return getNext(groups, currentDepth + 1);
			}

			return { groups, hasMore: !done };
		};

		const { groups, hasMore } = await getNext();

		if (this.generator !== generator) {
			return;
		}

		this.set({
			loading: false,
			groups,
			hasMore,
		});
	}

	#removeCourse = course => {
		this.setImmediate({
			groups: (this.get('groups') ?? []).map(group => {
				return {
					...group,
					Items: (group.Items ?? []).filter(
						c =>
							c !== course &&
							course.NTIID !== c.CatalogEntry?.CourseNTIID
					),
				};
			}),
		});
	};

	onCourseDelete(course) {
		this.#removeCourse(course);
	}
}

export const Store = Interfaces.Searchable(CourseCollectionStore);
