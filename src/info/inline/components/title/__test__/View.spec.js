import React from 'react';
import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Title view test', () => {
	test('Test title text', () => {
		const title = 'A Title';

		const catalogEntry = {
			'title': title
		};

		const x = render(<View catalogEntry={catalogEntry}/>);

		expect(x.container.querySelector('.course-view-title').textContent).toEqual(title);
	});
});
