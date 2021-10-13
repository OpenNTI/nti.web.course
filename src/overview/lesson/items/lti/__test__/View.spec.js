import renderer from 'react-test-renderer';

import { Summary } from '@nti/lib-interfaces';

import View from '../View';
import { List, Grid } from '../../../Constants';

const course = {};

function itemBuilder() {
	return {
		_id: 'item1',
		_MimeType: 'application/vnd.nextthought.ltiexternaltoolasset',
		_icon: 'http://www.test123.com/sample.png',
		_commentCount: null,
		_CompletionRequired: false,
		_title: 'LTI item 1',
		_description: 'this is a test LTI overview item',
		_byline: 'Ref Creator',
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
			};
		},
	};
}

/* eslint-env jest */
describe('Course overview LTI item test', () => {
	test('Grid item with 5 comments, completable, required', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = renderer.create(
			<View item={item} layout={Grid} course={course} />
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Grid item with no comments, completable, not required', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<View item={item} layout={Grid} course={course} />
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Grid item with no comments, completable, requirement editable', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<View
				item={item}
				onRequirementChange={() => {}}
				layout={Grid}
				course={course}
			/>
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
			<View item={item} layout={List} course={course} />
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item with no comments, completable, not required', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<View item={item} layout={List} course={course} />
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('List item with no comments, completable, requirement editable', async () => {
		const item = itemBuilder().completable().build();

		const cmp = renderer.create(
			<View
				item={item}
				onRequirementChange={() => {}}
				layout={List}
				course={course}
			/>
		);

		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
