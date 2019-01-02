import React from 'react';
import PropTypes from 'prop-types';

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render () {
		const { item } = this.props;
		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{item.title}</div>
				<div className="req-col req-item-score">{item.score}%</div>
				<div className="req-col req-item-target-score">{item.targetScore}%</div>
			</div>
		);
	}
}
