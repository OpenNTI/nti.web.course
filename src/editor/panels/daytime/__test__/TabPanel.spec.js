import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import TabPanel from '../TabPanel';


const wait = x => new Promise(f => setTimeout(f, x));


/* eslint-env jest */
describe('DayTime TabPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		Schedule: {
			days: [
				'MRF'	// monday, thursday, friday selected
			],
			times: [
				'8:15',
				'10:30'
			]
		}
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	let cmp = mount(
		<TabPanel
			catalogEntry={catalogEntry}
			saveCmp={SaveButton}
			onCancel={onCancel}
			afterSave={afterSave}
			buttonLabel={buttonLabel}
		/>
	);

	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string
	};

	function SaveButton ({onSave, label}) {
		return (
			<div onClick={onSave}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test save button', async () => {
		const node = cmp.find('.course-panel-continue').first();

		expect(node.text()).toBe(buttonLabel);

		node.simulate('click');

		await wait(1);

		expect(mockSave).toHaveBeenCalled();
		expect(afterSave).toHaveBeenCalled();
	});

	test('Test cancel button', async () => {
		const node = cmp.find('.course-panel-cancel').first();

		expect(node.text()).toBe('Cancel');

		node.simulate('click');

		await wait(1);

		expect(onCancel).toHaveBeenCalled();
	});


	test('Test weekday fields', () => {
		let dayNodes = cmp.find('.course-panel-day');

		let monday = dayNodes.at(1);
		let wednesday = dayNodes.at(3);
		let thursday = dayNodes.at(4);
		let friday = dayNodes.at(5);

		// initial state (mon, thurs, fri should be selected)
		expect(monday.prop('className')).toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(thursday.prop('className')).toMatch(/selected/);
		expect(friday.prop('className')).toMatch(/selected/);

		monday.simulate('click');
		wednesday.simulate('click');

		cmp.update();
		dayNodes = cmp.find('.course-panel-day');
		monday = dayNodes.at(1);
		wednesday = dayNodes.at(3);
		thursday = dayNodes.at(4);
		friday = dayNodes.at(5);

		// after clicking, wed, thurs and fri should be selected
		expect(monday.prop('className')).not.toMatch(/selected/);
		expect(wednesday.prop('className')).toMatch(/selected/);
		expect(thursday.prop('className')).toMatch(/selected/);
		expect(friday.prop('className')).toMatch(/selected/);
	});

	const verifyTime = (time, node) => {
		const [ hours, minutes ] = time.split(':');

		const hourNode = node.find('input[name="hours"]').first();
		const minuteNode = node.find('input[name="minutes"]').first();

		expect(hourNode.prop('value')).toEqual(hours);
		expect(minuteNode.prop('value')).toEqual(minutes);
	};

	test('Test time fields', () => {
		const startTime = cmp.find('.course-panel-starttime').first();
		const endTime = cmp.find('.course-panel-endtime').first();

		verifyTime(catalogEntry.Schedule.times[0], startTime);
		verifyTime(catalogEntry.Schedule.times[1], endTime);
	});

});
