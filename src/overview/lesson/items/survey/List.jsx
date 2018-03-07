import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseListItem';

import Label from './Label';

export default class LessonOverviewSurveyListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	render () {
		const {item} = this.props;

		return (
			<Base
				className="lesson-overview-survey-list-item"
				item={item}
				renderLabels={this.renderLabels}
				renderIcon={this.renderIcon}
			/>
		);
	}

	renderIcon = () => {
		return (
			<div className="lesson-overview-survey-list-item-icon" />
		);
	}

	renderLabels = () => {
		const {item} = this.props;

		return (
			<Label item={item} />
		);
	}
}
