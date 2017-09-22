import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import WizardPanel from '../WizardPanel';

/* eslint-env jest */
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

	test('Test date fields', () => {
		const dayNodes = cmp.find('.course-panel-day');

		const monday = dayNodes.at(1);
		const wednesday = dayNodes.at(3);
		const friday = dayNodes.at(5);

		// initial state is unselected
		expect(monday.prop('className')).not.toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(friday.prop('className')).not.toMatch(/selected/);

		monday.simulate('click');
		friday.simulate('click');

		// after clicking, they should be selected (except wednesday, which wasn't clicked)
		expect(monday.prop('className')).toMatch(/selected/);
		expect(wednesday.prop('className')).not.toMatch(/selected/);
		expect(friday.prop('className')).toMatch(/selected/);
	});

});
