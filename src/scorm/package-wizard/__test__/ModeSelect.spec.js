/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

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

		const x = render(
			<ModeSelect onModeSelect={onModeSelect} saveCmp={SaveButton}/>
		);

		const [updateOption, replaceOption] = x.container.querySelectorAll('.mode-option');

		expect(updateOption.querySelector('.name').textContent).toEqual('Update Package');
		expect(updateOption.querySelector('.description').textContent).toEqual('Learner progress will be kept, but it will adjust if content was added or removed.');
		expect(updateOption.querySelector('.hint').textContent).toEqual('Better for Small Changes');

		expect(replaceOption.querySelector('.name').textContent).toEqual('Replace Package');
		expect(replaceOption.querySelector('.description').textContent).toEqual('Replacing a course package will reset learner progress. All progress will be lost.');
		expect(replaceOption.querySelector('.hint').textContent).toEqual('Better for Larger Changes');

		// nothing selected at the beginning
		expect(updateOption.getAttribute('class')).not.toMatch(/selected/);
		expect(replaceOption.getAttribute('class')).not.toMatch(/selected/);

		fireEvent.click(updateOption);

		// after update click, only update is selected
		expect(updateOption.getAttribute('class')).toMatch(/selected/);
		expect(replaceOption.getAttribute('class')).not.toMatch(/selected/);

		fireEvent.click(x.container.querySelector('.course-panel-continue'));

		expect(mode).toEqual('UpdateSCORM');

		fireEvent.click(replaceOption);

		// after replace is clicked, selected switches from update to replace card
		expect(updateOption.getAttribute('class')).not.toMatch(/selected/);
		expect(replaceOption.getAttribute('class')).toMatch(/selected/);

		fireEvent.click(x.container.querySelector('.course-panel-continue'));

		expect(mode).toEqual('ImportSCORM');
	});
});
