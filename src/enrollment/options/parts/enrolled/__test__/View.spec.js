import React from 'react';
import renderer from 'react-test-renderer';

import View from '../View';
import Open from '../../../types/open';
import FiveMinute from '../../../types/five-minute';

const catalogEntry = {
	getStartDate: () => new Date('10/22/2017'),
	getEndDate: () => new Date('10/31/2017')
};

/* eslint-env jest */
describe('Course enrollment enrolled view', () => {
	test('No options', async () => {
		const options = [];

		const cmp = renderer.create(<View catalogEntry={catalogEntry} options={options}/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('One option, enrolled, upgrade available', async () => {
		const options = [
			new Open({ enrolled: true, available: true }, null, catalogEntry)
		];

		const cmp = renderer.create(<View catalogEntry={catalogEntry} options={options}/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Two options, second enrolled', async () => {
		const options = [
			new Open({ enrolled: true }, null, catalogEntry),
			new FiveMinute({ enrolled: false}, null, catalogEntry)
		];

		const cmp = renderer.create(<View catalogEntry={catalogEntry} options={options}/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
