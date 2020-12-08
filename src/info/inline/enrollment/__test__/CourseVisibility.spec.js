import React from 'react';
import { mount } from 'enzyme';

import CourseVisibility from '../CourseVisibility';

/* eslint-env jest */
describe('CourseVisibility test', () => {
	function makeCatalogEntry (Preview, isHidden, StartDate, optionNames) {
		let Items = {};

		(optionNames || []).forEach(o => {
			Items[o] = {
				enabled: true
			};
		});

		return {
			getEnrollmentOptions: function () {
				return {
					Items
				};
			},
			Preview,
			isHidden,
			StartDate,
			getStartDate: StartDate && (() => StartDate),
			hasLink (rel) {
				if (rel === 'edit') { return true;}
			}
		};
	}


	describe('Preview mode tests', () => {
		test('Test preview mode with start date', () => {
			const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true, new Date('10/31/2015'))}/>);

			const labeledContentItems = cmp.find('.labeled-content');
			const previewLabel = labeledContentItems.first().find('.label').first();
			const dateValue = labeledContentItems.first().find('.content').first();

			expect(previewLabel.prop('className')).toMatch(/preview/);
			expect(dateValue.text()).toEqual('Starts Oct. 31, 2015');

			const launchButton = cmp.find('.launch-button').first();

			expect(launchButton.exists()).toBe(true);
		});

		test('Test preview mode with no start date', () => {
			const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true)}/>);

			const labeledContentItems = cmp.find('.labeled-content');
			const previewLabel = labeledContentItems.first().find('.label').first();
			const dateValue = labeledContentItems.first().find('.content').first();

			expect(previewLabel.prop('className')).toMatch(/preview/);
			expect(dateValue.text()).toEqual('No Start Date');
		});

		test('Test no preview', () => {
			const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(false, true)}/>);

			const labeledContentItems = cmp.find('.labeled-content');
			const firstLabel = labeledContentItems.first().find('.label').first();

			// there shouldn't be a preview label so the first label we find should have
			// nothing to do with preview
			expect(firstLabel.prop('className')).not.toMatch(/preview/);
		});
	});


	// describe('Allowing enrollment tests', () => {
	// 	test('Test none', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true)}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('Invitation Only');
	// 	});

	// 	test('Test five minute enrollment', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true, null, ['FiveminuteEnrollment'])}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('For-Credit');
	// 	});

	// 	test('Test IMSEnrollment with SourcedID', () => {
	// 		const catalogEntry = {
	// 			getEnrollmentOptions: function () {
	// 				return {
	// 					Items: {
	// 						IMSEnrollment: {
	// 							SourcedID: '1234'
	// 						}
	// 					}
	// 				};
	// 			},
	// 			Preview: true,
	// 			hasLink: () => true
	// 		};

	// 		const cmp = mount(<CourseVisibility catalogEntry={catalogEntry}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('For-Credit');
	// 	});

	// 	test('Test IMSEnrollment without SourcedID', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true, null, ['IMSEnrollment'])}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('Invitation Only');
	// 	});

	// 	test('Test StoreEnrollment', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, false, null, ['StoreEnrollment'])}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('Public');
	// 	});

	// 	test('Test OpenEnrollment', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, false, null, ['OpenEnrollment'])}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('Public');
	// 	});

	// 	test('Test OpenEnrollment and FiveminuteEnrollment', () => {
	// 		const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, false, null, ['OpenEnrollment', 'FiveminuteEnrollment'])}/>);

	// 		const labeledContentItems = cmp.find('.labeled-content');
	// 		const enrollmentContent = labeledContentItems.at(1).find('.content').first();

	// 		expect(enrollmentContent.text()).toEqual('For-Credit, Public');
	// 	});
	// });


	describe('Visible in catalog tests', () => {
		test('Test is visible in catalog', () => {
			const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, false)}/>);

			const labeledContentItems = cmp.find('.labeled-content');
			const visibilityContent = labeledContentItems.last().find('.content').first();

			expect(visibilityContent.text()).toEqual('Yes');
		});

		test('Test is not visible in catalog', () => {
			const cmp = mount(<CourseVisibility catalogEntry={makeCatalogEntry(true, true)}/>);

			const labeledContentItems = cmp.find('.labeled-content');
			const visibilityContent = labeledContentItems.last().find('.content').first();

			expect(visibilityContent.text()).toEqual('No');
		});
	});
});
