import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Base from './Base';
import Registry from './Registry';

const DEFAULT_TEXT = {
	questionCount: {
		one: '1 Question',
		other: '%(count)s Questions',
	},
};
const t = scoped('web-course.progress.QuestionSetItem', DEFAULT_TEXT);

export default class QuestionSetProgressItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,
	};

	async componentDidMount() {
		const { item, course } = this.props;

		try {
			const questionSet = await course.getAssignment(
				item['Target-NTIID']
			);

			this.setState({
				questionSet,
			});
		} catch (e) {
			//todo: figure out what to do here if anything
		}
	}

	getLabels() {
		const { item } = this.props;

		return [
			t('questionCount', { count: item['question-count'] || 0 }),
			'Questionset',
		];
	}

	render() {
		const { item } = this.props;

		return (
			<Base
				item={item}
				labels={this.getLabels()}
				renderIcon={this.renderIcon}
			/>
		);
	}

	renderIcon = () => {};
}

Registry.register('application/vnd.nextthought.questionsetref')(
	QuestionSetProgressItem
);
