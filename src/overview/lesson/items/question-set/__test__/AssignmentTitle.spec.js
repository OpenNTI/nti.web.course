import React from 'react';
import renderer from 'react-test-renderer';

import AssignmentTitle from '../AssignmentTitle';

/* eslint-env jest */
describe('Course overview assignment title test', () => {
	test('Title only', async () => {
		const assignment = {
			title: 'My Assignment'
		};

		const cmp = renderer.create(
			<AssignmentTitle assignment={assignment}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Title with totalPoints', async () => {
		const assignment = {
			title: 'My Assignment',
			totalPoints: 5
		};

		const cmp = renderer.create(
			<AssignmentTitle assignment={assignment}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
