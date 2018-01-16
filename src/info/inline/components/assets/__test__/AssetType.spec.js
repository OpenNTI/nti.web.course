import React from 'react';
import { mount } from 'enzyme';

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

		const cmp = mount(<AssetType catalogEntry={catalogEntry} type="background"/>);

		const img = cmp.find('img').first();

		expect(img.prop('src')).toEqual('/root/background.png');
	});
});
