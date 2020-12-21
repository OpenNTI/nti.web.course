import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TabPanel from '../TabPanel';

/* eslint-env jest */
describe('Settings TabPanel test', () => {
	const mockSave = jest.fn();

	function makeCatalogEntry (isNonPublic, PreviewRawValue, StartDate) {
		return {
			save: () => {
				mockSave();
				return Promise.resolve();
			},
			PreviewRawValue,
			StartDate,
			isHidden: isNonPublic,
			Preview: PreviewRawValue ? true : false
		};
	}

	test('Test not publicly available, preview mode off', () => {
		const {container: root} = render(
			<TabPanel
				catalogEntry={makeCatalogEntry(true, false, null)}
			/>
		);

		const publiclyAvailableOption = root.querySelector('.publicly-available-option');

		expect(publiclyAvailableOption.textContent).toMatch(/Off/);
		expect(publiclyAvailableOption.querySelector('.toggle-button').getAttribute('class')).toMatch(/ off/);

		const previewModeOption = root.querySelector('.preview-mode-option');

		expect(previewModeOption.textContent).toMatch(/Off/);
		expect(previewModeOption.textContent).toMatch(/Course is visible/);
	});

	test('Test publicly available', () => {
		const {container: root} = render(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, false, null)}
			/>
		);

		const publiclyAvailableOption = root.querySelector('.publicly-available-option');

		expect(publiclyAvailableOption.textContent).toMatch(/On/);
		expect(publiclyAvailableOption.querySelector('.toggle-button').getAttribute('class')).toMatch(/ on/);
	});

	test('Test null preview, no start date', () => {
		const {container: root} = render(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, null, null)}
			/>
		);

		const previewModeOption = root.querySelector('.preview-mode-option');

		expect(previewModeOption.textContent).toMatch(/Based on start date/);
		expect(previewModeOption.textContent).toMatch(/No start date found/);
		expect(previewModeOption.querySelector('.preview-date-info').getAttribute('class')).toMatch(/ warning/);
	});

	test('Test null preview with start date', () => {
		const { container: root } = render(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, null, new Date('4/5/2017'))}
			/>
		);

		const previewModeOption = root.querySelector('.preview-mode-option');

		expect(previewModeOption.textContent).toMatch(/Based on start date/);
		expect(previewModeOption.textContent).toMatch(/April 5th 2017, 12:00 am/);
		expect(previewModeOption.querySelector('.preview-date-info').getAttribute('class')).not.toMatch(/ warning/);
	});

});
