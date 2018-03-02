import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { TestUtils } from 'nti-web-client';

import CourseWizard from '../CourseWizard';

const { setupTestClient, tearDownTestClient } = TestUtils;

/* eslint-env jest */
describe('CourseWizard test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const mockTitle = 'Course for editing';

	let cmp;

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

	beforeAll(() => {
		setupTestClient({
			getWorkspace: () => {},
			getCollection: () => {}
		});

		cmp = mount(
			<CourseWizard
				title={mockTitle}
				onCancel={onCancelMock}
				onSave={onSaveMock}
				saveCmp={SaveButton}
			/>
		);
	});

	afterAll(() => {
		tearDownTestClient();
	}); 

	test('Test close', (done) => {
		const closeButton = cmp.find('.close').first();

		closeButton.simulate('click');

		const verifyCalled = () => {
			expect(onCancelMock).toHaveBeenCalled();

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
