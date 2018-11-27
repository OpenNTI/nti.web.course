import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import { isFlag } from '@nti/web-client';
import { DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

// import Button from './Button';
// import Duration from './common/Duration';

const t = scoped('course.overview.lesson.items.event.BaseItem', {
	completed: 'Completed',
	incomplete: 'Incomplete'
});

export default class EventBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool,
		hideControls: PropTypes.bool,
		editMode: PropTypes.bool,
		onRequirementChange: PropTypes.func
	}


	state = {}

	renderDate () {
		const {item} = this.props;
		const {event} = item;

		if(!event) {
			return null;
		}

		return (
			<div className="date">
				<div className="month">{DateTime.format(event.getStartTime(), 'MMM')}</div>
				<div className="day">{event.getStartTime().getDate()}</div>
			</div>
		);
	}

	renderImageAndDescription () {
		const {item} = this.props;
		const {event} = item;

		const hasIcon = event.icon && event.icon !== 'null';

		return (
			<div className={cx('image-and-description', {iconless: !hasIcon})}>
				{hasIcon && <div className="image"><img src={event.icon}/>{this.renderStatus()}</div>}
				<pre className="description">{event.description}</pre>
			</div>
		);
	}

	isToday (a, b) {
		return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
	}

	renderAvailability () {
		const {item: {event}} = this.props;

		const now = Date.now();

		// default case, render 'Starts [day] from [startTime] - [endTime]'
		let timeDisplay = DateTime.format(event.getStartTime(), '[Starts] dddd [from] hh:mm a')
			+ ' - ' + DateTime.format(event.getEndTime(), 'hh:mm a z');

		if(event.isExpired()) {
			// render 'Expired [day] at [time]'
			timeDisplay = DateTime.format(event.getEndTime(), '[Expired] dddd [at] hh:mm a z');
		}
		else {
			const currDate = new Date(now);

			// determine if it's today
			if(this.isToday(currDate, event.getStartTime())) {
				timeDisplay = DateTime.format(event.getStartTime(), '[Starts Today at] hh:mm a z');
			}
		}

		return (
			<div className="availability-info">
				<div className="time-display">{timeDisplay}</div>
			</div>
		);
	}


	renderContents () {
		const {item: {event}, isMinimal, hideControls, editMode} = this.props;

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{event.subject}</div>
					{this.renderAvailability()}
				</div>
				{!hideControls && !editMode && this.renderButton()}
				{event && !isMinimal && this.renderImageAndDescription()}
			</div>
		);
	}

	renderButton () {

	}


	render () {
		const {item, isMinimal} = this.props;

		const cls = cx('event-base-item', {minimal: isMinimal, unavailable: !item || !item.event});

		return (
			<div className={cls}>
				{this.renderDate()}
				{this.renderContents()}
			</div>
		);
	}
}
