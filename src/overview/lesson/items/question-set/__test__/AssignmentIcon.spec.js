import React from 'react';
import renderer from 'react-test-renderer';

import AssignmentIcon from '../AssignmentIcon';

/* eslint-env jest */
describe('Course overview assignment icon test', () => {
	test('Completed, late', async () => {
		// const due = assignment.getDueDate();
		// const noSubmit = assignment.isNonSubmit();
		// const completed = assignmentHistory && assignmentHistory.Submission && assignmentHistory.Submission.getCreatedTime();

		const assignment = {
			getDueDate: () => new Date('10/22/2017'),
			isNonSubmit: () => false
		};

		const assignmentHistory = {
			Submission: {
				getCreatedTime: () => new Date('10/24/2017')
			}
		};

		const cmp = renderer.create(
			<AssignmentIcon assignment={assignment} assignmentHistory={assignmentHistory}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Non submit', async () => {
		const assignment = {
			getDueDate: () => null,
			isNonSubmit: () => true
		};

		const cmp = renderer.create(
			<AssignmentIcon assignment={assignment}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Completed on time', async () => {
		const assignment = {
			getDueDate: () => Date.now(),
			isNonSubmit: () => true
		};

		const assignmentHistory = {
			Submission: {
				getCreatedTime: () => new Date('10/24/2017')
			}
		};

		const cmp = renderer.create(
			<AssignmentIcon assignment={assignment} assignmentHistory={assignmentHistory}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
