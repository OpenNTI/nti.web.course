/* eslint-env jest */
import PropTypes from 'prop-types';
import { render, fireEvent, waitFor } from '@testing-library/react';

import WizardPanel from '../WizardPanel';

describe('DayTime WizardPanel test', () => {
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

	let root;
	beforeEach(() => {
		({ container: root } = render(
			<WizardPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		));
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

	test('Test date fields', async () => {
		const [
			,
			/*sun*/ monday /* tues */,
			,
			wednesday /*thurs*/,
			,
			friday,
		] = root.querySelectorAll('.course-panel-day');

		// initial state is unselected
		expect(monday.getAttribute('class')).not.toMatch(/selected/);
		expect(wednesday.getAttribute('class')).not.toMatch(/selected/);
		expect(friday.getAttribute('class')).not.toMatch(/selected/);

		fireEvent.click(monday);
		fireEvent.click(friday);

		await waitFor(() => {
			// after clicking, they should be selected (except wednesday, which wasn't clicked)
			expect(monday.getAttribute('class')).toMatch(/selected/);
			expect(wednesday.getAttribute('class')).not.toMatch(/selected/);
			expect(friday.getAttribute('class')).toMatch(/selected/);
		});
	});
});
