import React from 'react';
import renderer from 'react-test-renderer';

import { TestUtils } from '@nti/web-client';

import UserGradeCard from '../UserGradeCard';

const { tearDownTestClient, setupTestClient } = TestUtils;

const getMockService = () => {
	return {};
};

const onBefore = () => {
	jest.useFakeTimers();
	setupTestClient(getMockService());
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('Progress widgets user grade card test', () => {
	beforeEach(() => onBefore());
	afterEach(onAfter);

	test('With grade', async () => {
		const cmp = renderer.create(
			<UserGradeCard user="testuser" grade={76} />
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Without grade', async () => {
		const cmp = renderer.create(<UserGradeCard user="testuser" />);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
