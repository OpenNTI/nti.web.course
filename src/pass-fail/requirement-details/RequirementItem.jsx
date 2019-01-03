import React from 'react';
import PropTypes from 'prop-types';

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render () {
		const { item } = this.props;
		const { grade } = item;
		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{item.title}</div>
				<div className="req-col req-item-score">{grade && grade.value.replace('-', '')}%</div>
				<div className="req-col req-item-target-score">%</div>
			</div>
		);
	}
}
