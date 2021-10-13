import { render, waitFor } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import PublishCourse from '../PublishCourse';

let catalogEntry;

const mockService = () => ({
	getObject: o => Promise.resolve(catalogEntry),
});

const onBefore = () => {
	setupTestClient(mockService());
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('PublishCourse test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	const mockSave = jest.fn();

	function makeCatalogEntry(isNonPublic, PreviewRawValue, StartDate) {
		return {
			save: () => {
				mockSave();
				return Promise.resolve();
			},
			PreviewRawValue,
			getStartDate: () => StartDate,
			StartDate,
			isHidden: isNonPublic,
			Preview: PreviewRawValue ? true : false,
			getEnrollmentOptions: function () {
				return {};
			},
		};
	}

	test('Test not publicly available, preview mode off', async () => {
		catalogEntry = makeCatalogEntry(true, false, null);

		const x = render(<PublishCourse catalogEntry={catalogEntry} />);

		await waitFor(() => {
			const publiclyAvailableOption = x.container.querySelector(
				'.publicly-available-option'
			);

			expect(
				publiclyAvailableOption
					.querySelector('.toggle-button')
					.getAttribute('class')
			).toMatch(/ off/);

			const previewModeOption = x.container.querySelector(
				'.preview-mode-widget'
			);

			expect(previewModeOption.textContent).toMatch(/Published/);
			expect(previewModeOption.textContent).toMatch(
				/Content is available to learners/
			);
		});
	});

	test('Test publicly available', async () => {
		catalogEntry = makeCatalogEntry(false, false, null);

		const x = render(<PublishCourse catalogEntry={catalogEntry} />);

		await waitFor(() => {
			const publiclyAvailableOption = x.container.querySelector(
				'.publicly-available-option'
			);

			expect(publiclyAvailableOption.textContent).toMatch(/On/);
			expect(
				publiclyAvailableOption
					.querySelector('.toggle-button')
					.getAttribute('class')
			).toMatch(/ on/);
		});
	});

	test('Test null preview, no start date', async () => {
		catalogEntry = makeCatalogEntry(false, null, null);

		const x = render(<PublishCourse catalogEntry={catalogEntry} />);

		await waitFor(() => {
			const previewModeOption = x.container.querySelector(
				'.preview-mode-widget'
			);

			expect(previewModeOption.textContent).toMatch(
				/Publish on Start Date/
			);
			expect(previewModeOption.textContent).toMatch(
				/No start date found/
			);
		});
	});

	test('Test null preview with start date', async () => {
		catalogEntry = makeCatalogEntry(false, null, new Date('4/5/2017'));

		const x = render(<PublishCourse catalogEntry={catalogEntry} />);

		await waitFor(() => {
			const previewModeOption = x.container.querySelector(
				'.preview-mode-widget'
			);

			expect(previewModeOption.textContent).toMatch(
				/Publish on Start Date/
			);
			expect(previewModeOption.textContent).toMatch(
				/April 5th 2017, 12:00 AM/
			);
		});
	});
});
