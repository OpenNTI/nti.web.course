import React from 'react';
import PropTypes from 'prop-types';

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render () {
		const { item } = this.props;
		const grade = parseInt(item.grade.value.replace('-', ''), 10);
		const score = (Math.floor((grade / item.totalPoints) * 100) / 100);

		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{item.title}</div>
				<div className="req-col req-item-score">{score * 100}%</div>
				<div className="req-col req-item-target-score">{item.passingScore * 100}%</div>
			</div>
		);
	}
}
