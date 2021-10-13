import renderer from 'react-test-renderer';

import View from '../View';

const catalogEntry = {
	getStartDate: () => new Date('10/22/2017'),
	getEndDate: () => new Date('10/31/2017'),
};

/* eslint-env jest */
describe('Course enrollment administering view', () => {
	test('Test with access', async () => {
		const cmp = renderer.create(
			<View catalogEntry={catalogEntry} access={{}} />
		);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Test with no access', async () => {
		const cmp = renderer.create(<View catalogEntry={catalogEntry} />);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
