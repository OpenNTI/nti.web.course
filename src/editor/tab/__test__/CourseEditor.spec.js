import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import CourseEditor from '../CourseEditor';

const mockService = () => ({
	getObject: o => Promise.resolve(o),
});

const onBefore = () => {
	setupTestClient(mockService());
};

const onAfter = () => {
	tearDownTestClient();
};

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
		getDefaultAssetRoot() {},
		title: mockTitle,
		ProviderUniqueID: mockID,
		description: mockDescription,
	};

	const getCmp = () =>
		render(
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
		label: PropTypes.string,
	};

	function SaveButton({ onSave, label }) {
		return (
			<div onClick={onSave}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test labels', () => {
		const { container: root } = getCmp();

		expect(root.querySelector('.course-id').textContent).toEqual(mockID);
		expect(root.querySelector('.course-title').textContent).toEqual(
			mockTitle
		);
	});

	test('Test save', async () => {
		const { container: root } = getCmp();

		const saveButton = root.querySelector('.course-panel-continue');

		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalled();
		});
	});

	test('Test close', async () => {
		const { container: root } = getCmp();

		const closeButton = root.querySelector('.close');

		fireEvent.click(closeButton);

		await waitFor(() => {
			expect(onCancelMock).toHaveBeenCalled();
		});
	});

	test('Test cancel', async () => {
		const { container: root } = getCmp();

		const cancelButton = root.querySelector('.course-panel-cancel');

		fireEvent.click(cancelButton);

		await waitFor(() => {
			expect(onCancelMock).toHaveBeenCalled();
		});
	});
});
