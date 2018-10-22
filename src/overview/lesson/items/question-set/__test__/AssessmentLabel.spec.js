import React from 'react';
import renderer from 'react-test-renderer';

import AssessmentLabel from '../AssessmentLabel';

/* eslint-env jest */
describe('Course overview asessment label test', () => {
	test('Question count', async () => {
		const assessment = {
			'question-count': 15
		};

		const cmp = renderer.create(
			<AssessmentLabel assessment={assessment}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Question count with correct/incorrect', async () => {
		const assessment = {
			'question-count': 15
		};

		const assessmentSubmission = {
			getCorrect: () => 5,
			getIncorrect: () => 10
		};

		const cmp = renderer.create(
			<AssessmentLabel assessment={assessment} assessmentSubmission={assessmentSubmission}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Question count, required', async () => {
		const assessment = {
			'question-count': 15
		};

		const cmp = renderer.create(
			<AssessmentLabel assessment={assessment} required/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Question count, required editable', async () => {
		const assessment = {
			'question-count': 15
		};

		const overviewItemRef = {
			isCompletable: () => true
		};

		const cmp = renderer.create(
			<AssessmentLabel assessment={assessment} overviewItemRef={overviewItemRef} onRequirementChange={()=>{}}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
