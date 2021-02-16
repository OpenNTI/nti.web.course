import React from 'react';
import renderer from 'react-test-renderer';

import AssignmentLabel from '../AssignmentLabel';

function buildAssignment(
	assignedDate,
	dueDate,
	lastModified,
	maxTimeAllowed,
	duration,
	isPublished,
	isSubmitted,
	isTimed,
	noSubmit,
	canEdit
) {
	return {
		getAssignedDate: () =>
			assignedDate && typeof assignedDate === 'string'
				? new Date(assignedDate)
				: assignedDate,
		getDueDate: () =>
			dueDate && typeof dueDate === 'string'
				? new Date(dueDate)
				: dueDate,
		getLastModified: () =>
			lastModified && typeof lastModified === 'string'
				? new Date(lastModified)
				: lastModified,
		isPublished: () => isPublished,
		isNonSubmit: () => noSubmit,
		hasLink: () => canEdit,
		getMaximumTimeAllowed: () => maxTimeAllowed,
		getDuration: () => duration,
		isSubmitted: () => isSubmitted,
		isTimed,
	};
}

function assignmentBuilder() {
	return {
		assignedDateVal: null,
		dueDateVal: null,
		lastModifiedVal: new Date(),
		maxTimeAllowedVal: null,
		durationVal: null,
		isPublishedVal: false,
		isTimedVal: false,
		isSubmittedVal: false,
		noSubmitVal: false,
		canEditVal: false,

		assignedDate: function (val) {
			this.assignedDateVal = val;
			return this;
		},
		dueDate: function (val) {
			this.dueDateVal = val;
			return this;
		},
		lastModified: function (val) {
			this.lastModifiedVal = val;
			return this;
		},
		maxTimeAllowed: function (val) {
			this.maxTimeAllowedVal = val;
			return this;
		},
		duration: function (val) {
			this.durationVal = val;
			return this;
		},
		isPublished: function () {
			this.isPublishedVal = true;
			return this;
		},
		isSubmitted: function () {
			this.isSubmittedVal = true;
			return this;
		},
		isTimed: function () {
			this.isTimedVal = true;
			return this;
		},
		noSubmit: function () {
			this.noSubmitVal = true;
			return this;
		},
		canEdit: function () {
			this.canEditVal = true;
			return this;
		},
		build: function () {
			return buildAssignment(
				this.assignedDateVal,
				this.dueDateVal,
				this.lastModifiedVal,
				this.maxTimeAllowedVal,
				this.durationVal,
				this.isPublishedVal,
				this.isSubmittedVal,
				this.isTimedVal,
				this.noSubmitVal,
				this.canEditVal
			);
		},
	};
}

function buildAssignmentHistory(
	completedDate,
	isSynthetic,
	isSubmitted,
	isExcused
) {
	return {
		isSyntheticSubmission: () => isSynthetic,
		isSubmitted: () => isSubmitted,
		Submission: {
			getCreatedTime: () =>
				completedDate && typeof completedDate === 'string'
					? new Date(completedDate)
					: null,
		},
		grade: {
			isExcused: () => isExcused,
		},
	};
}

/* eslint-env jest */
describe('Course overview assignment label test', () => {
	test('Completed but late', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/22/2017')
			.isPublished()
			.isSubmitted()
			.noSubmit()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					'10/25/2017', // completedDate
					false, // isSynthetic
					true, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Draft', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					true, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('With duration', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.isPublished()
			.isTimed()
			.duration(1000000)
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					true, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Completed on time', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.isSubmitted()
			.noSubmit()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					'10/25/2017', // completedDate
					false, // isSynthetic
					true, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Not completed, overdue', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					false, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Not completed, overdue, but is no submit assignment', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.noSubmit()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					false, // isSubmitted
					false // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Not completed, but excused', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					false, // isSubmitted
					true // isExcused
				)}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Completable, optional, editable', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.canEdit()
			.build();

		const overviewItemRef = {
			isCompletable: () => true,
		};

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					false, // isSubmitted
					false // isExcused
				)}
				overviewItemRef={overviewItemRef}
				onRequirementChange={() => {}}
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Completable, required, not editable', async () => {
		const assignment = assignmentBuilder()
			.assignedDate('10/22/2017')
			.dueDate('10/30/2017')
			.isPublished()
			.build();

		const cmp = renderer.create(
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={buildAssignmentHistory(
					null, // completedDate
					false, // isSynthetic
					false, // isSubmitted
					false // isExcused
				)}
				required
			/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
