import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import View from '../View';

const mockService = () => ({
	getBatch: function () {
		return Promise.resolve({
			getLink: function (url) {
				return url;
			},
			Items: [
				{
					name: 'user1'
				},
				{
					name: 'user2'
				}
			]
		});
	}
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
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

Renderer.propTypes = {
	loading: PropTypes.bool,
	items: PropTypes.arrayOf(PropTypes.object)
};

function Renderer (props) {
	if(props.loading) {
		return <div>Loading...</div>;
	}

	if(props.items) {
		const text = 'Number of items: ' + props.items.length;

		return <div>{text}</div>;
	}

	return (
		<div>Nothing to show</div>
	);
}

/* eslint-env jest */
describe('Test roster view', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test view', (done) => {
		const course = {
			getLink: function (url) {
				return url;
			}
		};

		const cmp = mount(<View hasCourse course={course} renderRoster={Renderer}/>);

		expect(cmp.html()).toEqual('<div>Nothing to show</div>');

		setTimeout(function () {
			expect(cmp.html()).toEqual('<div>Number of items: 2</div>');

			done();
		}, 200);
	});
});
