import React from 'react';
import renderer from 'react-test-renderer';

import RequirementControlOption from '../RequirementControlOption';

/* eslint-env jest */
describe('Progress widgets requirement control option test', () => {
	test('Not selected', async () => {
		const cmp = renderer.create(
			<RequirementControlOption option={{ label: 'Option 1' }} />
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Selected', async () => {
		const cmp = renderer.create(
			<RequirementControlOption
				option={{ label: 'Option 1' }}
				isSelected
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
