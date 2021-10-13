import { render, act } from '@testing-library/react';

import * as TestUtils from '@nti/web-client/test-utils';
import { flushPromises } from '@nti/lib-commons/test-utils';

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
		const cmp = render(<UserGradeCard user="testuser" grade={76} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('Without grade', async () => {
		const cmp = render(<UserGradeCard user="testuser" />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});

		expect(cmp.asFragment()).toMatchSnapshot();
	});
});
