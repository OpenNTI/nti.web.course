import './DatePicker.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, DayTimePicker, Flyout } from '@nti/web-commons';

export default class DatePicker extends React.Component {
	static propTypes = {
		date: PropTypes.object,
		onChange: PropTypes.func,
		disabledDays: PropTypes.func,
	};

	attachFlyoutRef = x => (this.flyout = x);

	constructor(props) {
		super(props);

		this.state = {};
	}

	renderDateDisplay() {
		const { date } = this.props;

		if (!date) {
			return <div className="date no-date">{'Set a Date'}</div>;
		}

		return (
			<div className="date">
				<div>{DateTime.format(date)}</div>
				<div className="date-info">
					{DateTime.format(
						date,
						DateTime.WEEKDAY_AT_TIME_PADDED_WITH_ZONE
					)}
				</div>
			</div>
		);
	}

	renderIcon() {
		return (
			<div className="icon">
				<div className="calendar-hanger" />
				<div className="calendar-top" />
				<div className="calendar-bottom" />
			</div>
		);
	}

	renderTrigger() {
		return (
			<div className="date-picker">
				{this.renderIcon()}
				{this.renderDateDisplay()}
				<div className="trigger">
					<i className="icon-chevron-down small" />
				</div>
			</div>
		);
	}

	onDateSelect = (value, timeChanged) => {
		const { onChange } = this.props;

		// never dismiss automatically?  uncomment to auto-dismiss after selection

		// if(!timeChanged) {
		// 	this.flyout && this.flyout.dismiss();
		// }

		onChange && onChange(value);
	};

	render() {
		return (
			<Flyout.Triggered
				className="course-date-picker-flyout"
				trigger={this.renderTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachFlyoutRef}
			>
				<div>
					<DayTimePicker
						value={this.props.date}
						disabledDays={this.props.disabledDays}
						onChange={this.onDateSelect}
						retainTime
					/>
				</div>
			</Flyout.Triggered>
		);
	}
}
