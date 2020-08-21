import './BaseItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';
import {Hooks, Events} from '@nti/web-session';

function isToday (a, b) {
	return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

@Hooks.onEvent(Events.EVENT_UPDATED, 'onEventUpdated')
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

	onEventUpdated = async (newEvent) => {
		const {item} = this.props;
		const {CalendarEvent: event} = item;

		if (event.NTIID === newEvent.NTIID) {
			await event.refresh(newEvent);
			this.forceUpdate();
		}
	}

	renderDate () {
		const {item} = this.props;
		const {CalendarEvent: event} = item;

		if(!event) {
			return null;
		}

		return (
			<DateTime.DateIcon minimal date={event.getStartTime()} className="date" />
		);
	}

	renderImageAndDescription () {
		const {item} = this.props;
		const {CalendarEvent: event} = item;

		const hasIcon = event.icon && event.icon !== 'null';

		return (
			<div className={cx('image-and-description', {iconless: !hasIcon})}>
				{hasIcon && <div className="image"><img src={event.icon}/></div>}
				<div className="event-info">
					{event.location && <div className="location">{event.location}</div>}
					<pre className="description">{event.description}</pre>
				</div>
			</div>
		);
	}

	renderAvailability () {
		const {item: {CalendarEvent: event}} = this.props;

		// default case, render 'Starts [day] from [startTime] - [endTime]'
		let timeDisplay = DateTime.format(event.getStartTime(), '[Starts] dddd [from] hh:mm a')
			+ ' - ' + DateTime.format(event.getEndTime(), 'hh:mm a z');

		if(!isToday(event.getStartTime(), event.getEndTime())) {
			timeDisplay = DateTime.format(event.getStartTime(), '[Starts] dddd [at] hh:mm a')
				+ ' - ' + DateTime.format(event.getEndTime(), '[Ends] dddd LL [at] hh:mm a z');
		}

		return (
			<div className="availability-info">
				<div className="time-display">{timeDisplay}</div>
			</div>
		);
	}


	renderContents () {
		const {item: {CalendarEvent: event}, isMinimal, hideControls, editMode} = this.props;

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{event.title}</div>
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
		const {item, isMinimal, editMode} = this.props;

		const Wrapper = editMode ? 'div' : props => <LinkTo.Object object={item} {...props} />;

		const cls = cx('event-base-item', {minimal: isMinimal, unavailable: !item || !item.event});

		return (
			<Wrapper object={item} className={cls}>
				{this.renderDate()}
				{this.renderContents()}
			</Wrapper>
		);
	}
}
