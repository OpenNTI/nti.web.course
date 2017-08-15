/* eslint-env jest */
import getAvailableItems from '../get-available-items';
import {NEXT, PREVIOUS} from '../../Constants';

function makeItem (name) {
	return {
		props: {name}
	};
}

describe('get-available-items', () => {
	test('Has all Items', () => {
		const names = ['a', 'b', 'c', 'd'];
		const available = getAvailableItems(names.map(makeItem), 'a');

		for (let name of names) {
			expect(available[name]).toBeTruthy();
		}
	});

	test('Does not have extra', () => {
		const names = ['a', 'b', 'c', 'd'];
		const available = getAvailableItems(names.map(makeItem), 'b');

		const keys = Object.keys(available);

		expect(keys.length).toEqual(names.length + 2);//Next and Previous should've been added
	});

	describe('Next', () => {
		test ('Is available when active is not the last', () => {
			const names = ['a', 'b', 'c', 'd'];
			const available = getAvailableItems(names.map(makeItem), 'a');

			expect(available[NEXT]).toBeTruthy();
		});

		test('Is not available when active is the last', () => {
			const names = ['a', 'b', 'c', 'd'];
			const available = getAvailableItems(names.map(makeItem), 'd');

			expect(available[NEXT]).toBeFalsy();
		});
	});

	describe('Previous', () => {
		test ('Is available when active is not the first', () => {
			const names = ['a', 'b', 'c', 'd'];
			const available = getAvailableItems(names.map(makeItem), 'd');

			expect(available[PREVIOUS]).toBeTruthy();
		});

		test('Is not available when active is the first', () => {
			const names = ['a', 'b', 'c', 'd'];
			const available = getAvailableItems(names.map(makeItem), 'a');

			expect(available[PREVIOUS]).toBeFalsy();
		});
	});
});
