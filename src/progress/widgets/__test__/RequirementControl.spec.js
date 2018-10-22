import React from 'react';
import renderer from 'react-test-renderer';

import RequirementControl from '../RequirementControl';

/* eslint-env jest */
describe('Progress widgets requirement control test', () => {
	test('Default (required)', async () => {
		const record = {
			IsCompletionDefaultState: true,
			CompletionRequired: false,
			CompletionDefaultState: true
		};

		const cmp = renderer.create(
			<RequirementControl record={record}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Default (optional)', async () => {
		const record = {
			IsCompletionDefaultState: true,
			CompletionRequired: false,
			CompletionDefaultState: false
		};

		const cmp = renderer.create(
			<RequirementControl record={record}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Required', async () => {
		const record = {
			IsCompletionDefaultState: false,
			CompletionRequired: true,
			CompletionDefaultState: true
		};

		const cmp = renderer.create(
			<RequirementControl record={record}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Optional', async () => {
		const record = {
			IsCompletionDefaultState: false,
			CompletionRequired: false,
			CompletionDefaultState: true
		};

		const cmp = renderer.create(
			<RequirementControl record={record}/>
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
