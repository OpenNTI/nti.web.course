import { default as Store, KEYS } from '../Store';

/* eslint-env jest */
describe('Test roster store', () => {
	test('Test hasCourse/loadCourse', () => {
		const store = new Store();

		const url = 'someURL';

		expect(store.hasCourse).toBe(false);

		store.loadCourse({
			getLink: function () {
				return url;
			},
		});

		expect(store.hasCourse).toBe(true);

		expect(store.get('options').batchSize).toBe(20); // based on default
		expect(store.get('options').batchStart).toBe(0);
		expect(store.get('href')).toEqual(url);
	});

	test('Test searchTerm', () => {
		const { SEARCH_TERM: key } = KEYS;
		const store = new Store();

		const term = 'testSearch';

		expect(store.getOption(key)).toBeUndefined();

		store.updateSearchTerm(term);

		expect(store.getOption(key)).toEqual(term);
	});
});
