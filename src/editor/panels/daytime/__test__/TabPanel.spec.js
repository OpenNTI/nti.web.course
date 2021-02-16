/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TabPanel from '../TabPanel';

describe('DayTime TabPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		Schedule: {
			days: [
				'MRF', // monday, thursday, friday selected
			],
			times: ['8:15', '10:30'],
		},
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

	test('Test weekday fields', () => {
		const [
			,
			/*sun*/ monday /*tues*/,
			,
			wednesday,
			thursday,
			friday,
		] = result.container.querySelectorAll('.course-panel-day');

		// initial state (mon, thurs, fri should be selected)
		expect(monday.getAttribute('class')).toMatch(/selected/);
		expect(wednesday.getAttribute('class')).not.toMatch(/selected/);
		expect(thursday.getAttribute('class')).toMatch(/selected/);
		expect(friday.getAttribute('class')).toMatch(/selected/);

		fireEvent.click(monday);
		fireEvent.click(wednesday);

		// after clicking, wed, thurs and fri should be selected
		expect(monday.getAttribute('class')).not.toMatch(/selected/);
		expect(wednesday.getAttribute('class')).toMatch(/selected/);
		expect(thursday.getAttribute('class')).toMatch(/selected/);
		expect(friday.getAttribute('class')).toMatch(/selected/);
	});

	const verifyTime = (time, node) => {
		const [hours, minutes] = time.split(':');

		const hourNode = node.querySelector('input[name="hours"]');
		const minuteNode = node.querySelector('input[name="minutes"]');

		expect(hourNode.value).toEqual(hours);
		expect(minuteNode.value).toEqual(minutes);
	};

	test('Test time fields', () => {
		const startTime = result.container.querySelector(
			'.course-panel-starttime'
		);
		const endTime = result.container.querySelector('.course-panel-endtime');

		verifyTime(catalogEntry.Schedule.times[0], startTime);
		verifyTime(catalogEntry.Schedule.times[1], endTime);
	});
});
