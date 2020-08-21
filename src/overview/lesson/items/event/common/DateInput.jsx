import './DateInput.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {DayPicker, Flyout, DateTime} from '@nti/web-commons';
import cx from 'classnames';

const MINUTES_INCREMENT = 15;

const isSameDay = (a, b) => {
	return a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export default class EventDateInput extends React.Component {
	static propTypes = {
		label: PropTypes.string,
		date: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired
	}

	attachDateFlyoutRef = x => this.dateFlyout = x
	attachTimeFlyoutRef = x => this.timeFlyout = x

	state = {}

	determineAvailableTimes (date) {
		let startOfDay = new Date(date);
		startOfDay.setHours(0);
		startOfDay.setMinutes(0);
		startOfDay.setMilliseconds(0);

		let availableTimes = [];

		const now = Date.now();

		do {
			const currTime = startOfDay.getTime();

			if(currTime > now) {
				availableTimes.push(currTime);
			}

			startOfDay = new Date(currTime + (MINUTES_INCREMENT * 60 * 1000));
		} while (!(startOfDay.getHours() === 0 && startOfDay.getMinutes() === 0));

		this.setState({availableTimes: availableTimes.map(t=>new Date(t))}, () => {
			// if(availableTimes.length) {
			// 	this.props.onChange(this.state.availableTimes[0]);
			// }
		});
	}

	componentDidMount () {
		this.determineAvailableTimes(this.props.date);
	}

	componentDidUpdate (oldProps) {
		if(!isSameDay(oldProps.date, this.props.date)) {
			this.determineAvailableTimes(this.props.date);
		}
	}

	updateDate = (val) => {
		this.props.onChange(val);

		this.dateFlyout.dismiss();
	}

	renderDateTrigger () {
		return <div className="date-info"><span className="label">{this.props.label}</span>{DateTime.format(this.props.date, 'MMMM DD, YYYY')}<i className="icon-chevron-down"/></div>;
	}

	renderTimeTrigger (disabled) {
		const {date} = this.props;

		return (
			<div className={cx('time-value', {disabled})}>
				{DateTime.format(date, 'hh:mm a')}
				<i className="icon-chevron-down"/>
			</div>
		);
	}

	renderAvailableTime = (time) => {
		return (
			<div
				key={time.getTime()}
				className="available-time"
				onClick={() =>  {
					this.props.onChange(time);

					this.timeFlyout.dismiss();
				}
				}>
				{DateTime.format(time, 'hh:mm a')}
			</div>
		);
	}

	renderTime () {
		const {availableTimes} = this.state;
		if(!availableTimes || !availableTimes.length) {
			// disabled since there are no available times to choose from
			return this.renderTimeTrigger(true);
		}

		return (
			<Flyout.Triggered
				className="time-input"
				trigger={this.renderTimeTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachTimeFlyoutRef}
			>
				<div>
					{this.state.availableTimes && this.state.availableTimes.map(this.renderAvailableTime)}
				</div>
			</Flyout.Triggered>
		);
	}

	disabledDays = (value) => {
		const today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setMilliseconds(0);

		return value < today;
	}

	render () {
		return (
			<div className="date-input-container">
				<Flyout.Triggered
					className="event-date-input"
					trigger={this.renderDateTrigger()}
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					sizing={Flyout.SIZES.MATCH_SIDE}
					ref={this.attachDateFlyoutRef}
				>
					<div>
						<DayPicker value={this.props.date} disabledDays={this.disabledDays} onChange={this.updateDate}/>
					</div>
				</Flyout.Triggered>
				{this.renderTime()}
			</div>
		);
	}
}
