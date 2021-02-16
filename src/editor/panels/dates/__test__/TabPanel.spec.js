import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TabPanel from '../TabPanel';

/* eslint-env jest */
describe('Dates TabPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		StartDate: new Date(2017, 8, 22), // month is 0-indexed, 8 = Sep
		EndDate: new Date(2017, 11, 24), // month is 0-indexed, 11 = Dec
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
		const node = result.container.querySelector('.course-panel-cancel');

		expect(node.textContent).toBe('Cancel');

		fireEvent.click(node);

		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	test('Test date fields', async () => {
		const [startDate, endDate] = result.container.querySelectorAll('.date');

		// since there were provided values, initial state should show these dates
		expect(startDate.querySelector('.value').textContent).toBe('Sep 22');
		expect(endDate.querySelector('.value').textContent).toBe('Dec 24');

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
