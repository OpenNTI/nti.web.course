import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TestUtils } from '@nti/web-client';

import CourseWizard from '../CourseWizard';

const { setupTestClient, tearDownTestClient } = TestUtils;

/* eslint-env jest */
describe('CourseWizard test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const mockTitle = 'Course for editing';

	let root;

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

	beforeEach(() => {
		setupTestClient({
			getWorkspace: () => {
				return {};
			},
			getCollection: () => {
				return {
					accepts: ['application/vnd.nextthought.courses.scormcourseinstance']
				};
			}
		});

		({container: root} = render(
			<CourseWizard
				title={mockTitle}
				onCancel={onCancelMock}
				onSave={onSaveMock}
				saveCmp={SaveButton}
			/>
		));
	});

	afterEach(() => {
		tearDownTestClient();
	});

	test('Test available templates', async () => {
		await waitFor(() => {

			const templateNames = root.querySelectorAll('.template-name');

			expect(templateNames.length).toEqual(3);

			expect(templateNames[0].textContent).toEqual('Blank');
			expect(templateNames[1].textContent).toEqual('Import');
			expect(templateNames[2].textContent).toEqual('Scorm');
		});
	});

	test('Test close', async () => {
		await waitFor(() => {
			const closeButton = root.querySelector('.close');
			expect(closeButton).toBeTruthy();
			fireEvent.click(closeButton);
		});

		expect(onCancelMock).toHaveBeenCalled();
	});

	test('Test cancel', async () => {
		await waitFor(() => {
			const cancelButton = root.querySelector('.course-panel-cancel');
			expect(cancelButton).toBeTruthy();
			fireEvent.click(cancelButton);
		});
		expect(onCancelMock).toHaveBeenCalled();
	});
});
