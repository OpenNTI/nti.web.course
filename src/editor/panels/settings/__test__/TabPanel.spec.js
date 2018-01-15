import React from 'react';
import { mount } from 'enzyme';

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
			['is_non_public']: isNonPublic,
			Preview: PreviewRawValue ? true : false
		};
	}

	test('Test not publicly available, preview mode off', () => {
		let cmp = mount(
			<TabPanel
				catalogEntry={makeCatalogEntry(true, false, null)}
			/>
		);

		const publiclyAvailableOption = cmp.find('.publicly-available-option').first();

		expect(publiclyAvailableOption.text()).toMatch(/Off/);
		expect(publiclyAvailableOption.find('.toggle-button').first().prop('className')).toMatch(/ off/);

		const previewModeOption = cmp.find('.preview-mode-option').first();

		expect(previewModeOption.text()).toMatch(/Off/);
		expect(previewModeOption.text()).toMatch(/Course is visible/);
	});

	test('Test publicly available', () => {
		let cmp = mount(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, false, null)}
			/>
		);

		const publiclyAvailableOption = cmp.find('.publicly-available-option').first();

		expect(publiclyAvailableOption.text()).toMatch(/On/);
		expect(publiclyAvailableOption.find('.toggle-button').first().prop('className')).toMatch(/ on/);
	});

	test('Test null preview, no start date', () => {
		let cmp = mount(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, null, null)}
			/>
		);

		const previewModeOption = cmp.find('.preview-mode-option').first();

		expect(previewModeOption.text()).toMatch(/Based on start date/);
		expect(previewModeOption.text()).toMatch(/No start date found/);
		expect(previewModeOption.find('.preview-date-info').first().prop('className')).toMatch(/ warning/);
	});

	test('Test null preview with start date', () => {
		let cmp = mount(
			<TabPanel
				catalogEntry={makeCatalogEntry(false, null, new Date('4/5/2017'))}
			/>
		);

		const previewModeOption = cmp.find('.preview-mode-option').first();

		expect(previewModeOption.text()).toMatch(/Based on start date/);
		expect(previewModeOption.text()).toMatch(/April 5th 2017, 12:00 am/);
		expect(previewModeOption.find('.preview-date-info').first().prop('className')).not.toMatch(/ warning/);
	});

});
