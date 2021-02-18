/* eslint-env jest */
import combineGroups from '../combine-groups';

describe('combine course collection groups', () => {
	test('combines if the adjacent group names are the same', () => {
		const combined = combineGroups(
			[{name: 'group1', Items: ['first']}, {name: 'group2', Items: ['second']}],
			[{name: 'group2', Items: ['third']}, {name: 'group3', Items: ['fourth']}]
		);

		expect(combined.length).toBe(3);

		expect(combined[0].Items.length).toBe(1);
		expect(combined[0].Items[0]).toBe('first');

		expect(combined[1].Items.length).toBe(2);
		expect(combined[1].Items[0]).toBe('second');
		expect(combined[1].Items[1]).toBe('third');

		expect(combined[2].Items.length).toBe(1);
		expect(combined[2].Items[0]).toBe('fourth');
	});
});
