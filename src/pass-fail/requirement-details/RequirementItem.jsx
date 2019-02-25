import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.pass-fail.requirements-details.RequirementItem', {
	percentage: '%(score)s%%'
});

function getScore (item) {
	const numeric = item.getNumericUserPointsReceived();

	if (isNaN(numeric)) { return item.UserPointsReceived; }

	const score = Math.round((numeric / item.TotalPoints) * 100);

	return t('percentage', {score});
}

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render () {
		const { item } = this.props;
		const score = getScore(item);

		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{item.AssignmentTitle}</div>
				<div className="req-col req-item-score">{score}</div>
				<div className="req-col req-item-target-score">{item.CompletionRequiredPassingPercentage * 100}%</div>
			</div>
		);
	}
}
