/* eslint-env jest */
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import WizardPanel from '../WizardPanel';

describe('Basic WizardPanel test', () => {
	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	let result, root, cmp;
	beforeEach(() => {
		result = render(
			<WizardPanel
				ref={x => (cmp = x)}
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);
		root = result.container;
	});

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

	test('Test save button', async () => {
		const node = root.querySelector('.course-panel-continue');

		expect(node.textContent).toBe(buttonLabel);

		fireEvent.click(node);

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalled();
			expect(afterSave).toHaveBeenCalled();
		});
	});

	test('Test cancel button', async () => {
		const node = root.querySelector('.course-panel-cancel');

		expect(node.textContent).toBe('Cancel');

		fireEvent.click(node);

		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	const verifyInput = async (placeholder, stateField, value) => {
		cmp.setState({ [stateField]: value });

		await waitFor(() => {
			const node = root.querySelector(
				'[placeholder="' + placeholder + '"]'
			);

			expect(node.value).toEqual(value);
		});
	};

	test('Test fields', async () => {
		await verifyInput('Course Name', 'courseName', 'Test course name');
		await verifyInput(
			'Identification Number (i.e. UCOL-3224)',
			'identifier',
			'Test ID'
		);
		await verifyInput('Description', 'description', 'Test description');
	});
});
