import { render, fireEvent, waitFor } from '@testing-library/react';

import Section from '../Section';
import { Title, Description, MeetTimes } from '../';

/* eslint-env jest */
describe('Section test', () => {
	test('Test view mode', () => {
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description,
		};

		const { container: root } = render(
			<Section
				components={[Title, Description]}
				catalogEntry={catalogEntry}
			/>
		);

		expect(root.querySelector('.course-view-title').textContent).toEqual(
			title
		);
		expect(
			root.querySelector('.course-view-description').textContent
		).toEqual(description);
		expect(root.querySelector('.edit-course-info')).toBeFalsy();
	});

	test('Test view mode with no data', () => {
		const description = 'Some description';

		const catalogEntry = {
			description,
		};

		const { container } = render(
			<Section components={[MeetTimes]} catalogEntry={catalogEntry} />
		);

		// if there is no data for the contents of the Section, then nothing should be rendered
		// this is so students don't see sections that aren't relevant to the course
		expect(container.children.length).toBe(0);
	});

	test('Test edit mode', () => {
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description,
		};

		const { container: root } = render(
			<Section
				components={[Title, Description]}
				catalogEntry={catalogEntry}
				editable
			/>
		);

		expect(root.querySelector('.course-view-title').textContent).toEqual(
			title
		);
		expect(
			root.querySelector('.course-view-description').textContent
		).toEqual(description);
		expect(root.querySelector('.edit-course-info')).toBeTruthy();
	});

	test('Test edit mode with no data', () => {
		const description = 'Some description';

		const catalogEntry = {
			description,
		};

		const { container: root } = render(
			<Section
				components={[Title]}
				catalogEntry={catalogEntry}
				editable
			/>
		);

		// unlike the View mode, editable sections with no data should still appear
		// in the event that the editor wants to add data to that section
		expect(root.querySelector('.course-view-title')).toBeTruthy();
		expect(root.querySelector('.edit-course-info')).toBeTruthy();
	});
});

/* eslint-env jest */
describe('Section interactivity test', () => {
	test('Test edit button', () => {
		const beginEditing = jest.fn();
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description,
		};

		const { container: root } = render(
			<Section
				components={[Title, Description]}
				catalogEntry={catalogEntry}
				onBeginEditing={beginEditing}
				editable
			/>
		);

		const editButton = root.querySelector('.edit-course-info');

		fireEvent.click(editButton);

		expect(beginEditing).toHaveBeenCalled();
	});

	test('Test save/cancel', async () => {
		const endEditing = jest.fn();
		const mockSave = jest.fn();
		const title = 'Some title';
		const description = 'Some description';

		const titleToSave = 'new title';
		let actualSavedTitle;

		const catalogEntry = {
			title,
			description,
			save: obj => {
				mockSave();
				actualSavedTitle = obj.title;
				return Promise.resolve();
			},
		};

		let cmp;
		const { container: root } = render(
			<Section
				ref={x => (cmp = x)}
				components={[Title, Description]}
				catalogEntry={catalogEntry}
				onEndEditing={endEditing}
				isEditing
				editable
			/>
		);

		const cancel = root.querySelector('.cancel');

		fireEvent.click(cancel);

		expect(endEditing).toHaveBeenCalled();

		const save = root.querySelector('.save');

		fireEvent.click(save);

		expect(endEditing).toHaveBeenCalled();
		expect(mockSave).not.toHaveBeenCalled();

		cmp.setState({ pendingChanges: { title: titleToSave } });

		fireEvent.click(save);

		expect(endEditing).toHaveBeenCalled();

		await waitFor(() => {
			expect(mockSave).toHaveBeenCalled();
			expect(actualSavedTitle).toEqual(titleToSave);
		});
	});
});
