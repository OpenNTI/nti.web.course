import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import TabPanel from '../TabPanel';

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

	test('Test save button', (done) => {
		const node = cmp.find('.course-panel-continue').first();

		expect(node.text()).toBe(buttonLabel);

		node.simulate('click');

		const verifySaveCalled = () => {
			expect(mockSave).toHaveBeenCalled();
			expect(afterSave).toHaveBeenCalled();

			done();
		};

		setTimeout(verifySaveCalled, 300);
	});

	test('Test cancel button', (done) => {
		const node = cmp.find('.course-panel-cancel').first();

		expect(node.text()).toBe('Cancel');

		node.simulate('click');

		const verifyCancelCalled = () => {
			expect(onCancel).toHaveBeenCalled();

			done();
		};

		setTimeout(verifyCancelCalled, 300);
	});

	test('Test weekday fields', () => {
		const dayNodes = cmp.find('.course-panel-day');

		const monday = dayNodes.at(1);
		const wednesday = dayNodes.at(3);
		const thursday = dayNodes.at(4);
		const friday = dayNodes.at(5);

		// initial state (mon, thurs, fri should be selected)
		expect(monday.prop('className')).toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(thursday.prop('className')).toMatch(/selected/);
		expect(friday.prop('className')).toMatch(/selected/);

		monday.simulate('click');
		wednesday.simulate('click');

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
