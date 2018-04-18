import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {CircularProgress} from '@nti/web-charts';

import Base from '../../common/BaseAssessmentGridItem';

import Icon from './Icon';
import Label from './Label';

const DEFAULT_TEXT = {
	review: 'Review',
	closed: 'Closed',
	take: 'Take'
};
const t = scoped('course.overview.lesson.items.survey.Grid', DEFAULT_TEXT);

export default class LessonOverviewSurveyGridItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onRequirementChange: PropTypes.func
	}

	render () {
		const {item} = this.props;

		return (
			<Base
				item={item}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
				renderButton={this.renderButton}
			/>
		);
	}


	renderCompletedStatus () {
		const {item} = this.props;

		if(item.hasCompleted && item.hasCompleted()) {
			return (
				<div className="progress-icon">
					<CircularProgress width={20} height={20} isComplete/>
				</div>
			);
		}
	}


	renderIcon = () => {
		return (
			<div className="icon">
				<Icon large />
				{this.renderCompletedStatus()}
			</div>
		);
	}


	renderLabels = () => {
		const {item, onRequirementChange} = this.props;

		return (
			<Label item={item} onRequirementChange={onRequirementChange}/>
		);
	}

	renderButton = () => {
		const {item} = this.props;
		const text = item.isSubmitted ? t('review') : item.isClosed ? t('closed') : t('take');

		return (
			<Button rounded>
				{text}
			</Button>
		);
	}
}
