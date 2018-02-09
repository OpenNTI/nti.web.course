import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import TabPanel from '../TabPanel';


const wait = x => new Promise(f => setTimeout(f, x));

/* eslint-env jest */
describe('Dates TabPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		StartDate: new Date(2017, 8, 22), // month is 0-indexed, 8 = Sep
		EndDate: new Date(2017, 11, 24) // month is 0-indexed, 11 = Dec
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

		await wait(100);

		expect(mockSave).toHaveBeenCalled();
		expect(afterSave).toHaveBeenCalled();
	});

	test('Test cancel button', async () => {
		const node = cmp.find('.course-panel-cancel').first();

		expect(node.text()).toBe('Cancel');

		node.simulate('click');

		await wait(100);

		expect(onCancel).toHaveBeenCalled();
	});

	test('Test date fields', () => {
		let startDate = cmp.find('.date').first();
		let endDate = cmp.find('.date').last();

		// since there were provided values, initial state should show these dates
		expect(startDate.find('.value').first().text()).toBe('Sep. 22');
		expect(endDate.find('.value').first().text()).toBe('Dec. 24');

		// initial state, startDate selected, endDate not selected
		expect(startDate.prop('className')).toMatch(/selected/);
		expect(endDate.prop('className')).not.toMatch(/selected/);

		endDate.simulate('click');

		cmp.update();
		startDate = cmp.find('.date').first();
		endDate = cmp.find('.date').last();

		// after clicking end date, states should swap: now startDate not selected, endDate selected
		expect(startDate.prop('className')).not.toMatch(/selected/);
		expect(endDate.prop('className')).toMatch(/selected/);
	});

});
