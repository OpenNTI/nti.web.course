import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import TabPanel from '../TabPanel';

/* eslint-env jest */
describe('Basic TabPanel test', () => {
	const mockSave = jest.fn();
	const mockTitle = 'Course for editing';
	const mockID = 'TEST 1234';
	const mockDescription = 'Mock course used for editing test';

	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
		title: mockTitle,
		ProviderUniqueID: mockID,
		description: mockDescription
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

	const verifyInput = (placeholder, stateField, value) => {
		const node = cmp.find('[placeholder="' + placeholder + '"]').first();

		expect(node.prop('value')).toEqual(value);
	};

	test('Test fields', () => {
		verifyInput('Course Name', 'courseName', mockTitle);
		verifyInput('Identification Number (i.e. UCOL-3224)', 'identifier', mockID);
		verifyInput('Description', 'description', mockDescription);
	});

});
