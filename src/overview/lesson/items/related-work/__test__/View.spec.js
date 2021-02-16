import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { Summary } from '@nti/lib-interfaces';

import View from '../View';
import { List, Grid, Unpublished } from '../../../Constants';

function itemBuilder() {
	return {
		_id: 'item1',
		_MimeType: 'application/vnd.nextthought.relatedworkref',
		_icon: 'http://www.test123.com/sample.png',
		_commentCount: null,
		_CompletionRequired: false,
		_title: 'work ref 1',
		_description: 'this is a test related work ref overview item',
		_byline: 'Ref Creator',
		_completable: false,
		_TargetPublishState: null,

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

		unpublished: function () {
			this._TargetPublishState = Unpublished;
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
				TargetPublishState: this._TargetPublishState,
			};
		},
	};
}

class ContextProvider extends React.Component {
	static propTypes = {
		children: PropTypes.any,
	};

	static childContextTypes = {
		analyticsManager: PropTypes.object,
	};

	getChildContext = () => ({
		analyticsManager: {},
	});

	render() {
		return this.props.children;
	}
}

/* eslint-env jest */
describe('Course overview related work ref item test', () => {
	test('Grid item with 5 comments, completable, required', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={Grid} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Grid item with no comments, completable, not required', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={Grid} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Grid item with no comments, completable, requirement editable', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View
					item={item}
					onRequirementChange={() => {}}
					layout={Grid}
				/>
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Grid item unpublished', async () => {
		const item = itemBuilder().unpublished().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={Grid} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item with 5 comments, completable, required', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={List} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item with no comments, completable, not required', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={List} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item unpublished', async () => {
		const item = itemBuilder().unpublished().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View item={item} layout={List} />
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item with no comments, completable, requirement editable', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<ContextProvider>
				<View
					item={item}
					onRequirementChange={() => {}}
					layout={List}
				/>
			</ContextProvider>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
