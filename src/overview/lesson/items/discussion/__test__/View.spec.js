import React from 'react';
import renderer from 'react-test-renderer';
import { Summary } from '@nti/lib-interfaces';
import { TestUtils } from '@nti/web-client';

import View from '../View';
import { Grid } from '../../../Constants';

const { tearDownTestClient, setupTestClient } = TestUtils;

const getMockService = numberOfUsers => {
	return {
		async getObject() {
			return {
				title: 'Topic 1',
				TopicCount: 4,
				PostCount: 5,
			};
		},
	};
};

function itemBuilder() {
	return {
		_id: 'item1',
		_MimeType: 'application/vnd.nextthought.discussionref',
		_icon: 'http://www.test123.com/sample.png',
		_commentCount: null,
		_CompletionRequired: false,
		_title: 'Discussion item 1',
		_description: 'this is a test discussion overview item',
		_byline: 'Discussion Creator',
		_completable: false,

		commentCount: function (val) {
			this._commentCount = val;
			return this;
		},

		completable: function () {
			this._completable = true;
			return this;
		},

		required: function () {
			this._CompletionRequired = true;
			return this;
		},

		title: function (val) {
			this._title = val;
			return this;
		},

		description: function (val) {
			this._description = val;
			return this;
		},

		byline: function (val) {
			this._byline = val;
			return this;
		},

		build: function () {
			return {
				getID: () => this._id,
				icon: this._icon,
				MimeType: this._MimeType,
				[Summary]: {
					ItemCount: this._commentCount,
				},
				isCompletable: () => this._completable,
				CompletionRequired: this._CompletionRequired,
				title: this._title,
				description: this._description,
				byline: this._byline,
				resolveTarget: async () => {
					return {
						title: 'Topic 1',
						TopicCount: 4,
						PostCount: 5,
					};
				},
			};
		},
	};
}

/* eslint-env jest */
describe('Course overview discussion item test', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		setupTestClient(getMockService());
	});

	afterEach(() => {
		tearDownTestClient();
	});

	test('Grid item with 5 comments, completable, required', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = renderer.create(<View item={item} layout={Grid} />);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
