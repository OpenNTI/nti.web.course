import React from 'react';
import renderer from 'react-test-renderer';
import { TestUtils } from '@nti/web-client';

import View from '../View';

const { tearDownTestClient, setupTestClient } = TestUtils;

const getMockService = (mimeTypes) => {
	return {
		get: () => {
			return {
				'mime_types': mimeTypes
			};
		}
	};
};

const onBefore = (mimeTypes) => {
	jest.useFakeTimers();
	setupTestClient(getMockService(mimeTypes));
};

const onAfter = () => {
	tearDownTestClient();
};

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/* eslint-env jest */
describe('Course admin advanced completion test (with requirables)', () => {
	beforeEach(() => onBefore(['application/vnd.nextthought.assessment.assignment',
		'application/vnd.nextthought.assessment.timedassignment',
		'application/vnd.nextthought.assessment.discussionassignment',
		'application/vnd.nextthought.webinarasset',
		'application/vnd.nextthought.ntivideo',
		'application/vnd.nextthought.videoroll',
		'application/vnd.nextthought.surveyref',
		'application/vnd.nextthought.nasurvey',
		'application/vnd.nextthought.relatedworkref',
		'application/vnd.nextthought.ltiexternaltoolasset']));
	afterEach(onAfter);

	test('renders completable, certificate, percentage, default required', async () => {
		const course = {
			CatalogEntry: {
				hasLink: () => true
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: true,
				percentage: 0.5
			},
			getID: () => 'testCourse',
			hasLink: () => true
		};

		const cmp = renderer.create(<View course={course}/>);

		jest.runAllTimers();
		await flushPromises();
		jest.runAllTimers();

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('renders not completable', async () => {
		const course = {
			CatalogEntry: {
				hasLink: () => false
			},
			getID: () => 'testCourse',
			hasLink: () => false
		};

		const cmp = renderer.create(<View course={course}/>);

		jest.runAllTimers();
		await flushPromises();
		jest.runAllTimers();

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('renders completable, no certificate, no percentage', async () => {
		const course = {
			CatalogEntry: {
				hasLink: () => true
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: false,
			},
			getID: () => 'testCourse',
			hasLink: () => true
		};

		const cmp = renderer.create(<View course={course}/>);

		jest.runAllTimers();
		await flushPromises();
		jest.runAllTimers();

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('renders completable, no certificate, no percentage, default required disabled', async () => {
		const course = {
			CatalogEntry: {
				hasLink: () => true
			},
			CompletionPolicy: {
				hasLink: (l) => l !== 'UpdateDefaultRequiredPolicy',
				getLink: () => 'mockLink',
				offersCompletionCertificate: false,
			},
			getID: () => 'testCourse',
			hasLink: () => true
		};

		const cmp = renderer.create(<View course={course}/>);

		jest.runAllTimers();
		await flushPromises();
		jest.runAllTimers();

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

describe('Course admin advanced completion test (no requirables)', () => {
	beforeEach(() => onBefore([]));
	afterEach(onAfter);

	test('renders completable, certificate, percentage, default required', async () => {
		const course = {
			CatalogEntry: {
				hasLink: () => true
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: true,
				percentage: 0.5
			},
			getID: () => 'testCourse',
			hasLink: () => true
		};

		const cmp = renderer.create(<View course={course}/>);

		jest.runAllTimers();
		await flushPromises();
		jest.runAllTimers();

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
