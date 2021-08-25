import './Grid.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from "@nti/web-core";
import { scoped } from '@nti/lib-locale';
import { CircularProgress } from '@nti/web-charts';

import Base from '../../common/BaseAssessmentGridItem';

import Icon from './Icon';
import Label from './Label';

const DEFAULT_TEXT = {
	review: 'Review',
	closed: 'Closed',
	take: 'Take',
};
const t = scoped('course.overview.lesson.items.survey.Grid', DEFAULT_TEXT);

export default class LessonOverviewSurveyGridItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		noProgress: PropTypes.bool,
		onRequirementChange: PropTypes.func,
	};

	render() {
		const { item } = this.props;

		return (
			<Base
				item={item}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
				renderButton={this.renderButton}
			/>
		);
	}

	renderCompletedStatus() {
		const { item, noProgress } = this.props;

		if (!noProgress && item.hasCompleted && item.hasCompleted()) {
			return (
				<div className="progress-icon">
					<CircularProgress width={20} height={20} isComplete />
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
	};

	renderLabels = () => {
		const { item, onRequirementChange } = this.props;

		return <Label item={item} onRequirementChange={onRequirementChange} />;
	};

	renderButton = () => {
		const { item } = this.props;

		const startDate = item.getTargetAssignedDate();
		const now = new Date();

		let text = '';

		if (item.isSubmitted) {
			text = t('review');
		} else if (startDate && now < startDate) {
			text = '';
		} else if (item.isClosed) {
			text = t('closed');
		} else {
			text = t('take');
		}

		if (!text) {
			return null;
		}

		return (
			<Button as="span" rounded>
				{text}
			</Button>
		);
	};
}
