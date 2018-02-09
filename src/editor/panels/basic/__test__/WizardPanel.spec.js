/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import WizardPanel from '../WizardPanel';

const wait = x => new Promise(f => setTimeout(f, x));

describe('Basic WizardPanel test', () => {
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

	const verifyInput = (placeholder, stateField, value) => {
		cmp.setState({[stateField]: value});
		cmp.update();

		const node = cmp.find('[placeholder="' + placeholder + '"]').first();

		expect(node.prop('value')).toEqual(value);
	};

	test('Test fields', () => {
		verifyInput('Course Name', 'courseName', 'Test course name');
		verifyInput('Identification Number (i.e. UCOL-3224)', 'identifier', 'Test ID');
		verifyInput('Description', 'description', 'Test description');
	});

});
