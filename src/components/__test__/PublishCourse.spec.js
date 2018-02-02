import React from 'react';
import { mount } from 'enzyme';

import PublishCourse from '../PublishCourse';

let catalogEntry;

const mockService = () => ({
	getObject: (o) => Promise.resolve(catalogEntry)
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () => Promise.resolve(global.$AppConfig.nodeService)
		}
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

/* eslint-env jest */
describe('Settings TabPanel test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

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

	test('Test not publicly available, preview mode off', (done) => {
		catalogEntry = makeCatalogEntry(true, false, null);

		let cmp = mount(
			<PublishCourse
				courseId="someID"
			/>
		);

		setTimeout(function () {
			const publiclyAvailableOption = cmp.find('.publicly-available-option').first();

			expect(publiclyAvailableOption.text()).toMatch(/Off/);
			expect(publiclyAvailableOption.find('.toggle-button').first().prop('className')).toMatch(/ off/);

			const previewModeOption = cmp.find('.preview-mode-option').first();

			expect(previewModeOption.text()).toMatch(/Off/);
			expect(previewModeOption.text()).toMatch(/Course is visible/);

			done();
		}, 200);
	});

	test('Test publicly available', (done) => {
		catalogEntry = makeCatalogEntry(false, false, null);

		let cmp = mount(
			<PublishCourse
				courseId="someID"
			/>
		);

		setTimeout(function () {
			const publiclyAvailableOption = cmp.find('.publicly-available-option').first();

			expect(publiclyAvailableOption.text()).toMatch(/On/);
			expect(publiclyAvailableOption.find('.toggle-button').first().prop('className')).toMatch(/ on/);

			done();
		}, 200);
	});

	test('Test null preview, no start date', (done) => {
		catalogEntry = makeCatalogEntry(false, null, null);

		let cmp = mount(
			<PublishCourse
				courseId="someID"
			/>
		);

		setTimeout(function () {
			const previewModeOption = cmp.find('.preview-mode-option').first();

			expect(previewModeOption.text()).toMatch(/Based on start date/);
			expect(previewModeOption.text()).toMatch(/No start date found/);
			expect(previewModeOption.find('.preview-date-info').first().prop('className')).toMatch(/ warning/);

			done();
		}, 200);
	});

	test('Test null preview with start date', (done) => {
		catalogEntry = makeCatalogEntry(false, null, new Date('4/5/2017'));

		let cmp = mount(
			<PublishCourse
				courseId="someID"
			/>
		);

		setTimeout(function () {
			const previewModeOption = cmp.find('.preview-mode-option').first();

			expect(previewModeOption.text()).toMatch(/Based on start date/);
			expect(previewModeOption.text()).toMatch(/April 5th 2017, 12:00 am/);
			expect(previewModeOption.find('.preview-date-info').first().prop('className')).not.toMatch(/ warning/);

			done();
		}, 200);
	});

});
