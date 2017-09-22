import React from 'react';
import { mount } from 'enzyme';

import WizardItem from '../WizardItem';

/* eslint-env jest */
describe('WizardItem test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const mockTitle = 'Course for editing';
	const mockStepName = 'Step name for editing';
	const mockCmpContents = 'Mock contents';
	const mockLabel = 'Mock button label';

	const cmp = mount(
		<WizardItem
			title={mockTitle}
			stepName={mockStepName}
			onCancel={onCancelMock}
			afterSave={onSaveMock}
			wizardCmp={MockCmp}
			buttonLabel={mockLabel}
		/>
	);

	function MockCmp () {
		return (
			<div className="mock-contents">
				{mockCmpContents}
			</div>
		);
	}

	test('Test contents', () => {
		expect(cmp.find('.mock-contents').first().text()).toEqual(mockCmpContents);
	});

	test('Test labels', () => {
		expect(cmp.find('.course-panel-header-title').first().text()).toEqual(mockTitle);
		expect(cmp.find('.course-panel-header-stepname').first().text()).toEqual(mockStepName);
	});

	test('Test back button exists', () => {
		expect(cmp.find('.back').exists()).toBe(true);
	});

	test('Test back button does not exist for first tab', () => {
		const firstTabCmp = mount(
			<WizardItem
				title={mockTitle}
				stepName={mockStepName}
				onCancel={onCancelMock}
				afterSave={onSaveMock}
				wizardCmp={MockCmp}
				buttonLabel={mockLabel}
				firstTab
			/>
		);

		expect(firstTabCmp.find('.back').exists()).toBe(false);
	});
});
