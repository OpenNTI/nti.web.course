/* eslint-env jest */
import { setupTestClient } from '@nti/web-client/test-utils';

const data = {
	AdministeredCourses: [],
	ArchivedCourses: [],
	EnrolledCourses: [],
};

const onBefore = () =>
	setupTestClient({
		getEnrollment: () => ({
			addListener: jest.fn(),
			removeListener: jest.fn(),
		}),
		getCollection: (title, workspace) => {
			return {
				href: title,
				getLink: () => title,
			};
		},
		getBatch: async (href, params) => {
			return data[href];
		},
	});

describe('Home page test', () => {
	beforeEach(onBefore);
});
