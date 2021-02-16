import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Day extends React.Component {
	static propTypes = {
		day: PropTypes.object.isRequired,
		className: PropTypes.string,
		onClick: PropTypes.func,
		selected: PropTypes.bool,
	};

	onDayClick = () => {
		const { onClick, day } = this.props;

		onClick && onClick(day);
	};

	render() {
		const { day, className, selected } = this.props;

		let cls = cx(className || 'course-panel-day', { selected });

		return (
			<div className={cls} onClick={this.onDayClick}>
				{day.code}
			</div>
		);
	}
}
