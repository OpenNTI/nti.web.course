import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Redemption codes view test', () => {
	test('Test Redemption code items', () => {
		const redemptionCodes = [
			{
				Code: 'RC1',
			},
			{
				Code: 'RC2',
			},
		];

		const x = render(<View redemptionCodes={redemptionCodes} />);

		const items = x.container.querySelectorAll('.redemption-code');

		for (let i = 0; i < redemptionCodes.length; i++) {
			expect(items[i].textContent).toEqual(redemptionCodes[i].Code);
		}
	});

	test('Test no items', () => {
		const x = render(<View />);

		expect(
			x.container.querySelector('.content-column').textContent
		).toEqual('None');
	});
});
