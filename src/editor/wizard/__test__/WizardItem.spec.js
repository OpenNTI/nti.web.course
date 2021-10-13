import { render } from '@testing-library/react';

import WizardItem from '../WizardItem';

/* eslint-env jest */
describe('WizardItem test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const mockTitle = 'Course for editing';
	const mockStepName = 'Step name for editing';
	const mockCmpContents = 'Mock contents';
	const mockLabel = 'Mock button label';

	let root;
	beforeEach(() => {
		({ container: root } = render(
			<WizardItem
				title={mockTitle}
				stepName={mockStepName}
				onCancel={onCancelMock}
				afterSave={onSaveMock}
				wizardCmp={MockCmp}
				buttonLabel={mockLabel}
			/>
		));
	});

	function MockCmp() {
		return <div className="mock-contents">{mockCmpContents}</div>;
	}

	test('Test contents', () => {
		expect(root.querySelector('.mock-contents').textContent).toEqual(
			mockCmpContents
		);
	});

	test('Test labels', () => {
		expect(
			root.querySelector('.course-panel-header-title').textContent
		).toEqual(mockTitle);
		expect(
			root.querySelector('.course-panel-header-stepname').textContent
		).toEqual(mockStepName);
	});

	test('Test back button exists', () => {
		expect(root.querySelector('.back')).toBeTruthy();
	});

	test('Test back button does not exist for first tab', () => {
		const { container } = render(
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

		expect(container.querySelector('.back')).toBeFalsy();
	});
});
