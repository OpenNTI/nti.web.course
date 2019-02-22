import React from 'react';
import PropTypes from 'prop-types';

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render () {
		const { item } = this.props;
		const grade = item.UserPointsReceived;
		const score = Math.floor((grade / item.TotalPoints) * 100);

		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{item.AssignmentTitle}</div>
				<div className="req-col req-item-score">{score}%</div>
				<div className="req-col req-item-target-score">{item.CompletionRequiredPassingPercentage * 100}%</div>
			</div>
		);
	}
}
