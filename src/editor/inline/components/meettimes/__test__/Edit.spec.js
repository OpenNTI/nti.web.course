import React from 'react';
import { mount } from 'enzyme';

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
		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const days = cmp.find('.course-editor-day');
		const selectedIndexList = [1,3,5];

		expect(days.length).toBe(7);

		for(let i = 0; i < 7; i++) {
			const day = days.at(i);

			if(selectedIndexList.includes(i)) {
				expect(day.prop('className')).toMatch(/selected/);
			}
			else{
				expect(day.prop('className')).not.toMatch(/selected/);
			}
		}

		const startTime = cmp.find('.course-editor-starttime');
		const endTime = cmp.find('.course-editor-endtime');

		const verifyDate = (dateCmp, hourStr, minuteStr, amPm) => {
			const hours = dateCmp.find('[name="hours"]').first();
			const minutes = dateCmp.find('[name="minutes"]').first();

			expect(hours.props().value).toEqual(hourStr);
			expect(minutes.props().value).toEqual(minuteStr);
			expect(dateCmp.find('.option-label').first().text()).toEqual(amPm);
		};

		verifyDate(startTime, '10', '30', 'AM');
		verifyDate(endTime, '12', '20', 'PM');
	});

	test('Test interactivity', () => {
		const onChange = jest.fn();

		const cmp = mount(<Edit catalogEntry={catalogEntry} onValueChange={onChange}/>);

		const days = cmp.find('.course-editor-day');

		days.at(3).simulate('click');

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F'], times: ['10:30:00-05:00', '12:20:00-05:00']});

		days.at(4).simulate('click');

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['10:30:00-05:00', '12:20:00-05:00']});

		// after clicking wednesday and thursday, wednesday should now be unselected,
		// thursday should now be selected
		const selectedIndexList = [1,4,5];

		for(let i = 0; i < 7; i++) {
			const day = days.at(i);

			if(selectedIndexList.includes(i)) {
				expect(day.prop('className')).toMatch(/selected/);
			}
			else{
				expect(day.prop('className')).not.toMatch(/selected/);
			}
		}

		// go through and change the hours/minutes for start/end time fields
		const startTime = cmp.find('.course-editor-starttime');
		const endTime = cmp.find('.course-editor-endtime');

		startTime.find('[name="hours"]').first().simulate('change', {target: {value: '8'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:30:00-05:00', '12:20:00-05:00']});

		startTime.find('[name="minutes"]').first().simulate('change', {target: {value: '53'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '12:20:00-05:00']});

		endTime.find('[name="hours"]').first().simulate('change', {target: {value: '2'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '14:20:00-05:00']});

		endTime.find('[name="minutes"]').first().simulate('change', {target: {value: '27'}});

		expect(onChange).toHaveBeenCalledWith('Schedule', { days: ['M', 'F', 'R'], times: ['08:53:00-05:00', '14:27:00-05:00']});
	});
});
