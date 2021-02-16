/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import WizardPanel from '../WizardPanel';

describe('Dates WizardPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	let result, root;
	beforeEach(() => {
		result = render(
			<WizardPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);
		root = result.container;
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
		const node = root.querySelector('.course-panel-continue');

		expect(node.textContent).toBe(buttonLabel);

		fireEvent.click(node);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalled();
			expect(afterSave).toHaveBeenCalled();
		});
	});

	test('Test cancel button', async () => {
		const node = root.querySelector('.course-panel-cancel');

		expect(node.textContent).toBe('Cancel');

		fireEvent.click(node);

		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	test('Test date fields', async () => {
		const [startDate, endDate] = root.querySelectorAll('.date');

		// initial state, startDate selected, endDate not selected
		expect(startDate.getAttribute('class')).toMatch(/selected/);
		expect(endDate.getAttribute('class')).not.toMatch(/selected/);

		fireEvent.click(endDate);

		await waitFor(() => {
			// after clicking end date, states should swap: now startDate not selected, endDate selected
			expect(startDate.getAttribute('class')).not.toMatch(/selected/);
			expect(endDate.getAttribute('class')).toMatch(/selected/);
		});
	});
});
