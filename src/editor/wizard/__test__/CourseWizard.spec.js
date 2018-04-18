import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { TestUtils } from '@nti/web-client';

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
			getWorkspace: () => {
				return {};
			},
			getCollection: () => {
				return {
					accepts: ['application/vnd.nextthought.courses.scormcourseinstance']
				};
			}
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

	test('Test available templates', (done) => {
		const verify = () => {
			cmp.update();

			const templateNames = cmp.find('.template-name');

			expect(templateNames.length).toEqual(3);

			expect(templateNames.at(0).text()).toEqual('Blank');
			expect(templateNames.at(1).text()).toEqual('Import');
			expect(templateNames.at(2).text()).toEqual('Scorm');

			done();
		};

		setTimeout(verify, 300);
	});

	test('Test close', (done) => {
		const verify = () => {
			cmp.update();

			const closeButton = cmp.find('.close');

			closeButton.simulate('click');

			expect(onCancelMock).toHaveBeenCalled();

			done();
		};

		setTimeout(verify, 300);
	});

	test('Test cancel', (done) => {
		const verify = () => {
			cmp.update();

			const cancelButton = cmp.find('.course-panel-cancel').first();

			cancelButton.simulate('click');

			expect(onCancelMock).toHaveBeenCalled();

			done();
		};

		setTimeout(verify, 300);
	});
});
