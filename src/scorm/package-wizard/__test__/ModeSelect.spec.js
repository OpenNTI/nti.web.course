/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import ModeSelect from '../ModeSelect';

describe('ModeSelect view test', () => {
	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string
	};

	function done () {}

	function SaveButton ({onSave, label}) {
		const saveWithDone = function () {
			onSave(done);
		};

		return (
			<div onClick={saveWithDone}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test instructor', async () => {
		let mode = '';

		const onModeSelect = (newValue) => {
			mode = newValue;
		};

		const cmp = mount(
			<ModeSelect onModeSelect={onModeSelect} saveCmp={SaveButton}/>
		);

		const updateOption = cmp.find('.mode-option').first();
		const replaceOption = cmp.find('.mode-option').at(1);

		expect(updateOption.find('.name').text()).toEqual('Update Package');
		expect(updateOption.find('.description').text()).toEqual('Learner progress will be kept, but it will adjust if content was added or removed.');
		expect(updateOption.find('.hint').text()).toEqual('Better for Small Changes');

		expect(replaceOption.find('.name').text()).toEqual('Replace Package');
		expect(replaceOption.find('.description').text()).toEqual('Replacing a course package will reset learner progress. All progress will be lost.');
		expect(replaceOption.find('.hint').text()).toEqual('Better for Larger Changes');

		// nothing selected at the beginning
		expect(cmp.find('.mode-option').first().prop('className')).not.toMatch(/selected/);
		expect(cmp.find('.mode-option').at(1).prop('className')).not.toMatch(/selected/);

		updateOption.simulate('click');

		// after update click, only update is selected
		expect(cmp.find('.mode-option').first().prop('className')).toMatch(/selected/);
		expect(cmp.find('.mode-option').at(1).prop('className')).not.toMatch(/selected/);

		cmp.find('.course-panel-continue').first().simulate('click');

		expect(mode).toEqual('UpdateSCORM');

		replaceOption.simulate('click');

		// after replace is clicked, selected switches from update to replace card
		expect(cmp.find('.mode-option').first().prop('className')).not.toMatch(/selected/);
		expect(cmp.find('.mode-option').at(1).prop('className')).toMatch(/selected/);

		cmp.find('.course-panel-continue').first().simulate('click');

		expect(mode).toEqual('ImportSCORM');
	});
});
