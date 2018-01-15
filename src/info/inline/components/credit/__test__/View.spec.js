import React from 'react';
import { mount } from 'enzyme';

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

		const cmp = mount(<View catalogEntry={catalogEntry} enrollmentAccess={enrollmentAccess}/>);

		expect(cmp.find('.hours').first().text()).toEqual('5 Credits Available');

		const enrollLink = cmp.find('.enroll-link').first().find('a').first();

		expect(enrollLink.prop('href')).toEqual(URL);
		expect(enrollLink.text()).toEqual(LABEL);

		const openEnrollment = cmp.find('.open-enrollment').first();

		expect(openEnrollment.text()).toMatch(/You're registered for the open course./);
		expect(openEnrollment.text()).toMatch(/(No Credit)/);
	});

	test('Test single credit', () => {
		const catalogEntry = {
			Credit: [{
				Hours: 1
			}]
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.hours').first().text()).toEqual('1 Credit Available');
	});
});
