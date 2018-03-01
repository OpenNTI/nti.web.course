import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Base from '../../common/BaseListItem';

import {getAssignmentTitle, getAssignmentPoints} from './utils';

export default class LessonOverviewQuestionSetListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,

		assignment: PropTypes.object,
		assignmentHistory: PropTypes.object
	}

	render () {
		const {item} = this.props;

		return (
			<Base
				className="lesson-overview-question-set-list-item"
				item={item}
				renderTitle={this.renderTitle}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
			/>
		);
	}


	renderTitle = () => {
		const {assignment, item} = this.props;

		if (assignment) {
			return (
				<React.Fragment>
					<span className="assignment-title">{getAssignmentTitle(assignment)}</span>
					<span className="assignment-points">{getAssignmentPoints(assignment)}</span>
				</React.Fragment>
			);
		}

		return (item.title || item.label);
	}
}
