import './GradeCard.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.components.GradeCard', {
	currentGrade: 'Current Grade',
});

export default class GradeCard extends React.Component {
	static propTypes = {
		pointsEarned: PropTypes.number,
		totalPoints: PropTypes.number,
	};

	renderGrade() {
		const { pointsEarned, totalPoints } = this.props;

		const grade = totalPoints
			? parseInt(100 * (pointsEarned / totalPoints), 10)
			: 0;

		return (
			<div className="grade">
				<span>{grade}</span>
				<span className="pct">%</span>
			</div>
		);
	}

	renderPoints() {
		const { pointsEarned, totalPoints } = this.props;

		return (
			<div className="points">
				{pointsEarned} / {totalPoints}
			</div>
		);
	}

	render() {
		return (
			<div className="grade-card">
				{this.renderGrade()}
				<div className="current-grade-label">{t('currentGrade')}</div>
				{this.renderPoints()}
			</div>
		);
	}
}
