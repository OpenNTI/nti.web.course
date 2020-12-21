import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TemplateChooser from '../TemplateChooser';

class SaveButton extends React.Component {
	static propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string
	}

	doSave = () => {
		this.props.onSave(() => {});
	}

	render () {
		return (
			<div onClick={this.doSave}>
				<div className="course-panel-continue">{this.props.label}</div>
			</div>
		);
	}
}

/* eslint-env jest */
describe('TemplateChooser test', () => {
	const onCancelMock = jest.fn();
	const onSaveMock = jest.fn();
	const onTemplateSelectMock = jest.fn();
	const mockTitle = 'Course for editing';
	const mockLabel = 'Label for test';

	let root;
	beforeEach(() => {
		({container: root} = render(
			<TemplateChooser
				title={mockTitle}
				onCancel={onCancelMock}
				afterSave={onSaveMock}
				onTemplateSelect={onTemplateSelectMock}
				buttonLabel={mockLabel}
				saveCmp={SaveButton}
			/>
		));
	});

	test('Test save', async () => {
		const saveButton = root.querySelector('.course-panel-continue');

		expect(saveButton.textContent).toEqual(mockLabel);

		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(onTemplateSelectMock).toHaveBeenCalled();
		});
	});

	test('Test cancel', async () => {
		const cancelButton = root.querySelector('.course-panel-cancel');

		fireEvent.click(cancelButton);

		await waitFor(() => {
			expect(onCancelMock).toHaveBeenCalled();
		});
	});
});
