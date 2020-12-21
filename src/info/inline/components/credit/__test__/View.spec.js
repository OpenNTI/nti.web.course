import React from 'react';
import { render } from '@testing-library/react';

import View from '../View';

const URL = 'http://www.someurl.com';
const LABEL = 'Enrollment Label';

/* eslint-env jest */
describe('Credit view test', () => {
	test('Test credit view', () => {
		const catalogEntry = {
			Credit: [{
				Hours: 5,
				Enrollment: {
					url: URL,
					label: LABEL
				}
			}]
		};

		const enrollmentAccess = {
			LegacyEnrollmentStatus: 'Open'
		};

		const x = render(<View catalogEntry={catalogEntry} enrollmentAccess={enrollmentAccess}/>);

		expect(x.container.querySelector('.hours').textContent).toEqual('5 Credits Available');

		const enrollLink = x.container.querySelector('.enroll-link a');

		expect(enrollLink.getAttribute('href')).toEqual(URL);
		expect(enrollLink.textContent).toEqual(LABEL);

		const openEnrollment = x.container.querySelector('.open-enrollment');

		expect(openEnrollment.textContent).toMatch(/You’re registered for the open course./);
		expect(openEnrollment.textContent).toMatch(/(No Credit)/);
	});

	test('Test single credit', () => {
		const catalogEntry = {
			Credit: [{
				Hours: 1
			}]
		};

		const x = render(<View catalogEntry={catalogEntry}/>);

		expect(x.container.querySelector('.hours').textContent).toEqual('1 Credit Available');
	});
});
