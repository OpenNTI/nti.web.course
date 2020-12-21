import React from 'react';
import { render } from '@testing-library/react';

import AssetType from '../AssetType';

const mockService = () => ({
	getObject: (o) => Promise.resolve(o),
	get: (url) => {
		if(url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	}
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		username: 'TestUser',
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () => Promise.resolve(global.$AppConfig.nodeService)
		}
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

/* eslint-env jest */
describe('AssetType test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test img src is correct', () => {
		const catalogEntry = {
			presentationroot: '/root/'
		};

		const x = render(<AssetType catalogEntry={catalogEntry} type="background"/>);

		const img = x.container.querySelector('img');

		expect(img.getAttribute('src').indexOf('/root/background.png')).toEqual(0);
	});
});
