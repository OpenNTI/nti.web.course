import { render } from '@testing-library/react';

import CourseVisibility from '../CourseVisibility';

/* eslint-env jest */
describe('CourseVisibility test', () => {
	function makeCatalogEntry(Preview, isHidden, StartDate, optionNames) {
		let Items = {};

		(optionNames || []).forEach(o => {
			Items[o] = {
				enabled: true,
			};
		});

		return {
			getEnrollmentOptions: function () {
				return {
					Items,
				};
			},
			Preview,
			isHidden,
			StartDate,
			getStartDate: StartDate && (() => StartDate),
			hasLink(rel) {
				if (rel === 'edit') {
					return true;
				}
			},
		};
	}

	describe('Preview mode tests', () => {
		test('Test preview mode with start date', () => {
			const x = render(
				<CourseVisibility
					catalogEntry={makeCatalogEntry(
						true,
						true,
						new Date('10/31/2015')
					)}
				/>
			);

			const labeledContentItems =
				x.container.querySelector('.labeled-content');
			const previewLabel = labeledContentItems.querySelector('.label');
			const dateValue = labeledContentItems.querySelector('.content');

			expect(previewLabel.getAttribute('class')).toMatch(/alt/);
			expect(dateValue.textContent).toEqual('Starts Oct 31, 2015');

			const launchButton = x.container.querySelector('.launch-button');

			expect(launchButton).toBeTruthy();
		});

		test('Test preview mode with no start date', () => {
			const x = render(
				<CourseVisibility catalogEntry={makeCatalogEntry(true, true)} />
			);

			const labeledContentItems =
				x.container.querySelector('.labeled-content');
			const previewLabel = labeledContentItems.querySelector('.label');
			const dateValue = labeledContentItems.querySelector('.content');

			expect(previewLabel.getAttribute('class')).toMatch(/alt/);
			expect(dateValue.textContent).toEqual('No Start Date');
		});

		test('Test no preview', () => {
			const x = render(
				<CourseVisibility
					catalogEntry={makeCatalogEntry(false, true)}
				/>
			);

			const labeledContentItems =
				x.container.querySelector('.labeled-content');
			const firstLabel = labeledContentItems.querySelector('.label');

			// there shouldn't be a preview label so the first label we find should have
			// nothing to do with preview
			expect(firstLabel.getAttribute('class')).not.toMatch(/alt/);
		});
	});

	describe('Visible in catalog tests', () => {
		test('Test is visible in catalog', () => {
			const x = render(
				<CourseVisibility
					catalogEntry={makeCatalogEntry(true, false)}
				/>
			);

			const labeledContentItems = Array.from(
				x.container.querySelectorAll('.labeled-content')
			);
			const visibilityContent = labeledContentItems
				.pop()
				.querySelector('.content');

			expect(visibilityContent.textContent).toEqual('Yes');
		});

		test('Test is not visible in catalog', () => {
			const x = render(
				<CourseVisibility catalogEntry={makeCatalogEntry(true, true)} />
			);

			const labeledContentItems = Array.from(
				x.container.querySelectorAll('.labeled-content')
			);
			const visibilityContent = labeledContentItems
				.pop()
				.querySelector('.content');

			expect(visibilityContent.textContent).toEqual('No');
		});
	});
});
