import { render } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import AssetType from '../AssetType';

const mockService = () => ({
	getObject: o => Promise.resolve(o),
	get: url => {
		if (url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	},
});

const onBefore = () => {
	setupTestClient(mockService(), 'TestUser');
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('AssetType test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test img src is correct', () => {
		const catalogEntry = {
			presentationroot: '/root/',
		};

		const x = render(
			<AssetType catalogEntry={catalogEntry} type="background" />
		);

		const img = x.container.querySelector('img');

		expect(img.getAttribute('src').indexOf('/root/background.png')).toEqual(
			0
		);
	});
});
