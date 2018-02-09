/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import WizardPanel from '../WizardPanel';


const wait = x => new Promise(f => setTimeout(f, x));

describe('DayTime WizardPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		}
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	let cmp = mount(
		<WizardPanel
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

	test('Test date fields', () => {
		let dayNodes = cmp.find('.course-panel-day');

		let monday = dayNodes.at(1);
		let wednesday = dayNodes.at(3);
		let friday = dayNodes.at(5);

		// initial state is unselected
		expect(monday.prop('className')).not.toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(friday.prop('className')).not.toMatch(/selected/);

		monday.simulate('click');
		friday.simulate('click');

		cmp.update();
		dayNodes = cmp.find('.course-panel-day');
		monday = dayNodes.at(1);
		wednesday = dayNodes.at(3);
		friday = dayNodes.at(5);

		// after clicking, they should be selected (except wednesday, which wasn't clicked)
		expect(monday.prop('className')).toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(friday.prop('className')).toMatch(/selected/);
	});

});
