/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TabPanel from '../TabPanel';

describe('Basic TabPanel test', () => {
	const mockSave = jest.fn();
	const mockTitle = 'Course for editing';
	const mockID = 'TEST 1234';
	const mockDescription = 'Mock course used for editing test';

	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		title: mockTitle,
		ProviderUniqueID: mockID,
		description: mockDescription,
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	let result;
	beforeEach(() => {
		result = render(
			<TabPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);
	});

	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string,
	};

	function SaveButton({ onSave, label }) {
		return (
			<div onClick={onSave}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test save button', async () => {
		const node = result.container.querySelector('.course-panel-continue');

		expect(node.textContent).toBe(buttonLabel);

		fireEvent.click(node);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalled();
			expect(afterSave).toHaveBeenCalled();
		});
	});

	test('Test cancel button', async () => {
		const node = await result.findByText('Cancel');

		expect(node.textContent).toBe('Cancel');

		fireEvent.click(node);

		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	const verifyInput = (placeholder, stateField, value) => {
		const node = result.container.querySelector(
			'[placeholder="' + placeholder + '"]'
		);

		expect(node.value).toEqual(value);
	};

	test('Test fields', () => {
		verifyInput('Course Name', 'courseName', mockTitle);
		verifyInput(
			'Identification Number (i.e. UCOL-3224)',
			'identifier',
			mockID
		);
		verifyInput('Description', 'description', mockDescription);
	});
});
