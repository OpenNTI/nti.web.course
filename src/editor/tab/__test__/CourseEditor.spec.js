import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import CourseEditor from '../CourseEditor';

/* eslint-env jest */
describe('CourseEditor test', () => {
	const onCancelMock = jest.fn();
	const onFinishMock = jest.fn();
	const onSaveMock = jest.fn();
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

	const cmp = mount(
		<CourseEditor
			title={mockTitle}
			catalogEntry={catalogEntry}
			onCancel={onCancelMock}
			onFinish={onFinishMock}
			onSave={onSaveMock}
			saveCmp={SaveButton}
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

	test('Test labels', () => {
		expect(cmp.find('.course-id').first().text()).toEqual(mockID);
		expect(cmp.find('.course-title').first().text()).toEqual(mockTitle);
	});

	test('Test save', (done) => {
		const saveButton = cmp.find('.course-panel-continue').first();

		saveButton.simulate('click');

		const verifyCalled = () => {
			expect(mockSave).toHaveBeenCalled();

			done();
		};

		verifyCalled();
	});

	test('Test close', (done) => {
		const closeButton = cmp.find('.close').first();

		closeButton.simulate('click');

		const verifyCalled = () => {
			expect(onCancelMock).toHaveBeenCalled();

			done();
		};

		verifyCalled();
	});

	test('Test cancel', (done) => {
		const cancelButton = cmp.find('.course-panel-cancel').first();

		cancelButton.simulate('click');

		const verifyCalled = () => {
			expect(onCancelMock).toHaveBeenCalled();

			done();
		};

		verifyCalled();
	});
});
