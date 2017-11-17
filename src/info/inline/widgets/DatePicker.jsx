import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, DayPicker, Flyout } from 'nti-web-commons';

export default class DatePicker extends React.Component {
	static propTypes = {
		date: PropTypes.object,
		onChange: PropTypes.func,
		disabledDays: PropTypes.func
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderDateDisplay () {
		const { date } = this.props;

		if(!date) {
			return (<div className="date no-date">{'Set a Date'}</div>);
		}

		return (
			<div className="date">
				<div>{DateTime.format(date)}</div>
				<div className="date-info">{DateTime.format(date, 'dddd [at] hh:mm a z')}</div>
			</div>
		);
	}

	renderIcon () {
		return (
			<div className="icon">
				<div className="calendar-hanger"/>
				<div className="calendar-top"/>
				<div className="calendar-bottom"/>
			</div>
		);
	}

	renderTrigger () {
		return (
			<div className="date-picker">
				{this.renderIcon()}
				{this.renderDateDisplay()}
				<div className="trigger"><i className="icon-chevron-down small"/></div>
			</div>
		);
	}

	onDateSelect = (value) => {
		const { onChange } = this.props;

		this.flyout && this.flyout.dismiss();

		onChange && onChange(value);
	}

	render () {
		return (<Flyout.Triggered
			className="course-date-picker-flyout"
			trigger={this.renderTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachFlyoutRef}
		>
			<div>
				<DayPicker value={this.props.date} disabledDays={this.props.disabledDays} onChange={this.onDateSelect}/>
			</div>
		</Flyout.Triggered>);
	}
}
