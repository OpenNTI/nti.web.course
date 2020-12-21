import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { wait } from '@nti/lib-commons';

import Edit from '../Edit';

/* eslint-env jest */
describe('Meeting times editor test', () => {
	const Schedule = {
		days: ['M', 'W', 'F'],
		times: ['10:30:00-05:00', '12:20:00-05:00']
	};

	const catalogEntry = {
		Schedule
	};

	test('Test view', () => {
		const x = render(<Edit catalogEntry={catalogEntry}/>);

		const days = x.container.querySelectorAll('div.course-editor-day');
		const selectedIndexList = [1,3,5];

		// console.log(days.debug());
		expect(days.length).toBe(7);

		for(let i = 0; i < 7; i++) {
			const day = days[i];

			if(selectedIndexList.includes(i)) {
				expect(day.getAttribute('class')).toMatch(/selected/);
			}
			else{
				expect(day.getAttribute('class')).not.toMatch(/selected/);
			}
		}

		const startTime = x.container.querySelector('.course-editor-starttime');
		const endTime = x.container.querySelector('.course-editor-endtime');

		const verifyDate = (dateCmp, hour, minute, amPm) => {
			const hours = dateCmp.querySelector('[name="hours"]');
			const minutes = dateCmp.querySelector('[name="minutes"]');

			expect(hours.value).toEqual(hour.toString());
			expect(minutes.value).toEqual(minute.toString());
			expect(dateCmp.querySelector('.option-label').textContent).toEqual(amPm);
		};

		verifyDate(startTime, 10, 30, 'AM');
		verifyDate(endTime, 12, 20, 'PM');
	});

	test('Test interactivity', async () => {
		const onChange = jest.fn();

		const x = render(<Edit catalogEntry={catalogEntry} onValueChange={onChange}/>);

		let days = x.container.querySelectorAll('div.course-editor-day');

		fireEvent.click(days[3]);

		await wait();

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F'], times: ['10:30:00-05:00', '12:20:00-05:00']});

		fireEvent.click(days[4]);

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['10:30:00-05:00', '12:20:00-05:00']});

		// after clicking wednesday and thursday, wednesday should now be unselected,
		// thursday should now be selected
		const selectedIndexList = [1,4,5];

		for(let i = 0; i < 7; i++) {
			const day = days[i];

			if(selectedIndexList.includes(i)) {
				expect(day.getAttribute('class')).toMatch(/selected/);
			}
			else{
				expect(day.getAttribute('class')).not.toMatch(/selected/);
			}
		}

		// go through and change the hours/minutes for start/end time fields
		const startTime = x.container.querySelector('.course-editor-starttime');
		const endTime = x.container.querySelector('.course-editor-endtime');

		fireEvent.change(startTime.querySelector('[name="hours"]'), {target: {value: '8'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:30:00-05:00', '12:20:00-05:00']});

		fireEvent.change(startTime.querySelector('[name="minutes"]'), {target: {value: '53'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '12:20:00-05:00']});

		fireEvent.change(endTime.querySelector('[name="hours"]'), {target: {value: '2'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '14:20:00-05:00']});

		fireEvent.change(endTime.querySelector('[name="minutes"]'), {target: {value: '27'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '14:27:00-05:00']});
	});
});
