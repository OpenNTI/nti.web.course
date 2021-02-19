import {Stores, Interfaces} from '@nti/lib-store';
import {getService} from '@nti/web-client';

import combineGroups from './utils/combine-groups';
import getSemester from './utils/get-semester';

const BatchSize = 40;

const Sections = {
	'AdministeredCourses': [
		{rel: 'upcoming'},
		{rel: 'current'},
		{rel: 'archived', grouper: getSemester}
	],
	'EnrolledCourses': [
		{rel: 'upcoming'},
		{rel: 'current'},
		{rel: 'archived', grouper: getSemester}
	]
};

function getSection (collection, section, extraParams = {}) {
	let offset = 0;
	let done = false;

	const loadNextGroups = async () => {
		if (done) { return  {}; }

		const params = {
			...extraParams,
			batchSize: BatchSize,
			batchStart: offset
		};

		try {
			const service = await getService();
			const batch = await service.getBatch(collection.getLink(section.rel), params);

			//if we got back less than the batch size this section is done
			//I know `done || true` is the same as `true`, but lint doesn't like just true
			if (batch.Items.length < params.batchSize) { done = done || true; }

			offset += batch.Items.length;

			if (!section.grouper) {
				return [{name: section.rel, Items: batch.Items}];
			}

			return combineGroups(
				batch.Items.map(item => ({
					name: section.grouper(item),
					parent: section.rel,
					Items: [item]
				}))
			);
		} catch (e) {
			return [{name: e, error: e}];
		}
	};

	return {
		loadNextGroups,
		get done () { return done; }
	};
}

function getSections (collection, extraParams) {
	const sections = (Sections[collection.Title] ?? [{rel: 'self'}])
		.map(s => getSection(collection, s, extraParams));

	const loadNext = async (prev = []) => {
		const current = sections.find(s => !s.done);

		if (!current) { return prev; }

		const next = await current.loadNextGroups();
		const result = combineGroups(prev, next);
		const count = result.reduce((acc, g) => acc + g.Items.length, 0);

		if (count >= BatchSize) {
			return result;
		}

		return loadNext(result);
	};

	let activeLoad = null;

	return {
		loadNextGroups: () => {
			activeLoad = (activeLoad || Promise.resolve).then(() => loadNext());

			return activeLoad;
		},
		get done () { return sections.every(s => s.done);},
	};
}


class CourseCollectionStore extends Stores.BoundStore {
	bindingDidUpdate (prevBinding) {
		return prevBinding.collection !== this.binding.collection;
	}

	applySearchTerm (term) {
		if (term !== this.lastSearchTerm) {
			this.setImmediate({
				loading: true,
				groups: null
			});
		}

	}

	async load () {
		if (this.lastSearchTerm === this.searchTerm) { return; }

		const collection = this.collection = this.binding.collection;
		const searchTerm = this.lastSearchTerm = this.searchTerm;

		if (!collection) {
			this.set({
				groups: [{name: 'empty', Items: []}],
				hasMore: false
			});

			return;
		}

		this.setImmediate({
			collection,
			loading: true,
			error: null,
			groups: null,
			hasMore: false
		});

		try {
			this.sections = searchTerm ?
				getSection(collection, {rel: 'self'}, {filter: searchTerm}) :
				getSections(collection);

			const initialGroups = await this.sections.loadNextGroups();

			if (this.searchTerm !== searchTerm) { return; }

			this.set({
				loading: false,
				groups: initialGroups,
				hasMore: !this.sections.done
			});
		} catch (e) {
			if (this.searchTerm !== searchTerm) { return; }

			this.set({
				loading: false,
				error: e
			});
		}

	}

	async loadMore () {
		if (this.sections.done) { return; }

		this.setImmediate({
			loading: true
		});

		const current = this.get('groups');
		const next = await this.sections.loadNextGroups();

		this.set({
			groups: combineGroups(current, next),
			hasMore: !this.sections.done
		});
	}

	onCourseDelete (course) {
		this.setImmediate({
			groups: (this.get('groups') ?? []).map((group) => {
				return {
					...group,
					Items: (group.Items ?? []).filter(c => c !== course)
				};
			})
		});
	}

}

export default Interfaces.Searchable(CourseCollectionStore);
