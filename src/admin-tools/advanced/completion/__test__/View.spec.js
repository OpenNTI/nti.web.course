import { render, act } from '@testing-library/react';

import * as TestUtils from '@nti/web-client/test-utils';
import { flushPromises } from '@nti/lib-commons/test-utils';

import View from '../View';

const { tearDownTestClient, setupTestClient } = TestUtils;

const getMockService = mimeTypes => {
	return {
		get: () => {
			return {
				mime_types: mimeTypes,
			};
		},
	};
};

const onBefore = mimeTypes => {
	jest.useFakeTimers();
	setupTestClient(getMockService(mimeTypes));
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('Course admin advanced completion test (with requirables)', () => {
	beforeEach(() =>
		onBefore([
			'application/vnd.nextthought.assessment.assignment',
			'application/vnd.nextthought.assessment.timedassignment',
			'application/vnd.nextthought.assessment.discussionassignment',
			'application/vnd.nextthought.webinarasset',
			'application/vnd.nextthought.ntivideo',
			'application/vnd.nextthought.videoroll',
			'application/vnd.nextthought.surveyref',
			'application/vnd.nextthought.nasurvey',
			'application/vnd.nextthought.relatedworkref',
			'application/vnd.nextthought.ltiexternaltoolasset',
		])
	);
	afterEach(onAfter);

	test('renders completable, certificate, percentage, default required', async () => {
		const course = {
			CatalogEntry: {
				fetchLink: rel => {
					if ((rel?.rel || rel) === 'CertificateRenderers') {
						return {
							terms: [{ value: 'wut' }],
						};
					}
				},
				hasLink: () => true,
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: true,
				percentage: 0.5,
			},
			getID: () => 'testCourse',
			hasLink: () => true,
		};

		const cmp = render(<View course={course} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});
		// FIXME: assert things about the dom, instead of just matching a snapshot
		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('renders not completable', async () => {
		const course = {
			CatalogEntry: {
				fetchLink: rel => {
					if ((rel?.rel || rel) === 'CertificateRenderers') {
						return {
							terms: [{ value: 'wut' }],
						};
					}
				},
				hasLink: () => false,
			},
			getID: () => 'testCourse',
			hasLink: () => false,
		};

		const cmp = render(<View course={course} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});
		// FIXME: assert things about the dom, instead of just matching a snapshot
		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('renders completable, no certificate, no percentage', async () => {
		const course = {
			CatalogEntry: {
				fetchLink: rel => {
					if ((rel?.rel || rel) === 'CertificateRenderers') {
						return {
							terms: [{ value: 'wut' }],
						};
					}
				},
				hasLink: () => true,
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: false,
			},
			getID: () => 'testCourse',
			hasLink: () => true,
		};

		const cmp = render(<View course={course} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});
		// FIXME: assert things about the dom, instead of just matching a snapshot
		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('renders completable, no certificate, no percentage, default required disabled', async () => {
		const course = {
			CatalogEntry: {
				fetchLink: rel => {
					if ((rel?.rel || rel) === 'CertificateRenderers') {
						return {
							terms: [{ value: 'wut' }],
						};
					}
				},
				hasLink: () => true,
			},
			CompletionPolicy: {
				hasLink: l => l !== 'UpdateDefaultRequiredPolicy',
				getLink: () => 'mockLink',
				offersCompletionCertificate: false,
			},
			getID: () => 'testCourse',
			hasLink: () => true,
		};

		const cmp = render(<View course={course} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});

		// FIXME: assert things about the dom, instead of just matching a snapshot
		expect(cmp.asFragment()).toMatchSnapshot();
	});
});

describe('Course admin advanced completion test (no requirables)', () => {
	beforeEach(() => onBefore([]));
	afterEach(onAfter);

	test('renders completable, certificate, percentage, default required', async () => {
		const course = {
			CatalogEntry: {
				fetchLink: rel => {
					if ((rel?.rel || rel) === 'CertificateRenderers') {
						return {
							terms: [{ value: 'wut' }],
						};
					}
				},
				hasLink: () => true,
			},
			CompletionPolicy: {
				hasLink: () => true,
				getLink: () => 'mockLink',
				offersCompletionCertificate: true,
				percentage: 0.5,
			},
			getID: () => 'testCourse',
			hasLink: () => true,
		};

		const cmp = render(<View course={course} />);

		await act(async () => {
			jest.runAllTimers();
			await flushPromises();
			jest.runAllTimers();
		});

		// FIXME: assert things about the dom, instead of just matching a snapshot
		expect(cmp.asFragment()).toMatchSnapshot();
	});
});
