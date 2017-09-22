import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import TemplateChooser from '../TemplateChooser';

/* eslint-env jest */
describe('TemplateChooser test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const onTemplateSelectMock = jest.fn();
	const mockTitle = 'Course for editing';
	const mockLabel = 'Label for test';

	const cmp = mount(
		<TemplateChooser
			title={mockTitle}
			onCancel={onCancelMock}
			afterSave={onSaveMock}
			onTemplateSelect={onTemplateSelectMock}
			buttonLabel={mockLabel}
			saveCmp={SaveButton}
		/>
	);

	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string
	};

	function SaveButton ({onSave, label}) {
		const doSave = () => { onSave(() => {}); };

		return (
			<div onClick={doSave}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test save', (done) => {
		const saveButton = cmp.find('.course-panel-continue').first();

		expect(saveButton.text()).toEqual(mockLabel);

		saveButton.simulate('click');

		const verifyCalled = () => {
			expect(onTemplateSelectMock).toHaveBeenCalled();

			done();
		};

		setTimeout(verifyCalled, 300);
	});

	test('Test cancel', (done) => {
		const cancelButton = cmp.find('.course-panel-cancel').first();

		cancelButton.simulate('click');

		const verifyCalled = () => {
			expect(onCancelMock).toHaveBeenCalled();

			done();
		};

		setTimeout(verifyCalled, 300);
	});
});
