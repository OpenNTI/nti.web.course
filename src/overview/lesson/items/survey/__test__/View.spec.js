import { render } from '@testing-library/react';

import { Summary } from '@nti/lib-interfaces';

import View from '../View';
import { List, Grid } from '../../../Constants';

function itemBuilder() {
	return {
		_id: 'item1',
		_MimeType: 'application/vnd.nextthought.surveyref',
		_icon: 'http://www.test123.com/sample.png',
		_commentCount: null,
		_CompletionRequired: false,
		_title: 'Survey item 1',
		_description: 'this is a test survey overview item',
		_byline: 'Survey Creator',
		_completable: false,
		_questionCount: 0,
		_submissions: 0,
		_isSubmitted: false,
		_isClosed: false,
		_published: true,
		_assignedDate: null,
		_dueDate: null,

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

		questionCount: function (val) {
			this._questionCount = val;
			return this;
		},

		submissions: function (val) {
			this._submissions = val;
			return this;
		},

		published: val => {
			this._published = val;
			return this;
		},

		assignedDate: val => {
			this._assignedDate = val;
			return this;
		},

		dueDate: val => {
			this._dueDate = val;
			return this;
		},

		submitted: function () {
			this._isSubmitted = true;
			return this;
		},

		closed: function () {
			this._isClosed = true;
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
				getQuestionCount: () => this._questionCount,
				isCompletable: () => this._completable,
				CompletionRequired: this._CompletionRequired,
				title: this._title,
				description: this._description,
				byline: this._byline,
				submissions: this._submissions,
				isSubmitted: this._isSubmitted,
				isClosed: this._isClosed,
				isTargetPublished: () => this._published,
				getTargetAssignedDate: () => this._assignedDate,
				getTargetDueDate: () => this._dueDate,
			};
		},
	};
}

/* eslint-env jest */
describe('Course overview survey item test', () => {
	test('Grid item with 5 comments, completable, required, no questions or submissions', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = render(<View item={item} layout={Grid} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('Grid item with 3 questions, 4 submissions', async () => {
		const item = itemBuilder().questionCount(3).submissions(4).build();

		const cmp = render(<View item={item} layout={Grid} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('Grid item submitted', async () => {
		const item = itemBuilder().submitted().build();

		const cmp = render(<View item={item} layout={Grid} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('Grid item closed', async () => {
		const item = itemBuilder().closed().build();

		const cmp = render(<View item={item} layout={Grid} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('Grid item with 5 comments, completable, requirement editable', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = render(
			<View item={item} onRequirementChange={() => {}} layout={Grid} />
		);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('List item with 5 comments, completable, required, no questions or submissions', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = render(<View item={item} layout={List} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('List item with 3 questions, 4 submissions', async () => {
		const item = itemBuilder().questionCount(3).submissions(4).build();

		const cmp = render(<View item={item} layout={List} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('List item submitted', async () => {
		const item = itemBuilder().submitted().build();

		const cmp = render(<View item={item} layout={List} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('List item closed', async () => {
		const item = itemBuilder().closed().build();

		const cmp = render(<View item={item} layout={List} />);

		expect(cmp.asFragment()).toMatchSnapshot();
	});

	test('List item with 5 comments, completable, requirement editable', async () => {
		const item = itemBuilder()
			.commentCount(5)
			.completable()
			.required()
			.build();

		const cmp = render(
			<View item={item} onRequirementChange={() => {}} layout={List} />
		);

		expect(cmp.asFragment()).toMatchSnapshot();
	});
});
