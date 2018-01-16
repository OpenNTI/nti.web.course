import React from 'react';
import { mount } from 'enzyme';

import WizardPanel from '../WizardPanel';

const CONFIRMATION_MESSAGE = 'Import process started.  The course will automatically be updated when the process completes.';

/* eslint-env jest */
describe('Import confirmation test', () => {
	test('Test appearance', () => {
		let cmp = mount(
			<WizardPanel/>
		);

		expect(cmp.find('.import-in-progress').text()).toEqual(CONFIRMATION_MESSAGE);
	});
});
