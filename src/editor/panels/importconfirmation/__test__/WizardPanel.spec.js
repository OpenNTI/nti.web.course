import React from 'react';
import { render } from '@testing-library/react';

import WizardPanel from '../WizardPanel';

const CONFIRMATION_MESSAGE = 'Import process is taking longer than expected.  The course will automatically be updated when the process completes.';

/* eslint-env jest */
describe('Import confirmation test', () => {
	test('Test appearance', () => {
		let {container} = render(
			<WizardPanel/>
		);

		expect(container.querySelector('.import-in-progress').textContent).toEqual(CONFIRMATION_MESSAGE);
	});
});
