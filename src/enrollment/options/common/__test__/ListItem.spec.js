import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from '../ListItem';

/* eslint-env jest */
describe('Course enrollment options common list item ', () => {
	test('Selected with price', async () => {
		const cmp = renderer.create(<ListItem title="my item" price={50} selected/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Selected with no price, enrolled', async () => {
		const cmp = renderer.create(<ListItem title="my item" enrolled selected/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Title only', async () => {
		const cmp = renderer.create(<ListItem title="my item"/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
