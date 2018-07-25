import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.items.webinar.BaseItem', {
	register: 'Register',
	join: 'Join',
	noLongerAvailable: 'This webinar is no longer available'
});

export default class WebinarBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool,
		hideControls: PropTypes.bool,
		editMode: PropTypes.bool
	}


	state = {}


	renderDate () {
		const {item} = this.props;
		const {webinar} = item;

		if(!webinar) {
			return null;
		}

		const nearestSession = webinar.getNearestSession();

		return (
			<div className="date">
				<div className="month">{DateTime.format(nearestSession.getStartTime(), 'MMM')}</div>
				<div className="day">{nearestSession.getStartTime().getDate()}</div>
			</div>
		);
	}


	renderImageAndDescription () {
		const {item} = this.props;
		const {webinar} = item;

		// check icon for null string.  if we remove an icon and PUT to the record, it won't be null, but "null"
		return (
			<div className="image-and-description">
				<div className="image">{item.icon && item.icon !== 'null' ? <img src={item.icon}/> : <div>No Image</div>}</div>
				<div className="description">{webinar.description}</div>
			</div>
		);
	}


	renderContents () {
		const {item, isMinimal, hideControls, editMode} = this.props;
		const {webinar} = item;
		const nearestSession = webinar && webinar.getNearestSession();

		const timeDisplay = nearestSession && DateTime.format(nearestSession.getStartTime(), '[Available] dddd [from] hh:mm a')
			+ ' - ' + DateTime.format(nearestSession.getEndTime(), 'hh:mm a z');

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{webinar ? webinar.subject : t('noLongerAvailable')}</div>
					<div className="time-info">{timeDisplay}</div>
				</div>
				{!hideControls && !editMode && this.renderButton()}
				{webinar && !isMinimal && this.renderImageAndDescription()}
			</div>
		);
	}


	renderButton () {
		const {item} = this.props;
		const {webinar} = item;

		if(!webinar) {
			return null;
		}

		const nearestSession = webinar.getNearestSession();

		// nearest session start time is in the past, assume it's expired and show nothing
		if(!nearestSession || nearestSession.getStartTime() < Date.now()) {
			return null;
		}

		// user has already registered for the webinar, show join button
		if(webinar.hasLink('JoinWebinar')) {
			return this.renderJoinButton();
		}

		// user has not registered, show register button
		return this.renderRegisterButton();
	}


	renderJoinButton () {
		// TODO: Join button is disabled if not available yet,
		// TODO: render a timer when within 1hour of expiry

		const {item: {webinar}} = this.props;

		// check if the webinar is currently active.  Enable button if so, disable if not available yet.
		// TODO: move into model to be something like isJoinable or isAvailable(date = now)
		const now = Date.now();
		const enabled = (x => x && x.getStartTime() <= now && x.getEndTime() >= now)(webinar.getNearestSession());

		return (
			<a target="_blank"
				rel="noopener noreferrer"
				href={enabled ? webinar.getLink('JoinWebinar') : null}
			>
				<button disabled={!enabled}>{t('join')}</button>
			</a>
		);
	}


	renderRegisterButton () {
		const {props: {item}, state: {register}} = this;
		const toggle = x => this.setState({register: !!x});
		const open = () => toggle(true);
		const close = () => toggle(false);

		return (
			<React.Fragment>
				<button onClick={open} disabled={register}>{t('register')}</button>
				{register && (
					<GotoWebinar.Registration item={item} onBeforeDismiss={close}/>
				)}
			</React.Fragment>
		);
	}


	render () {
		const cls = cx('webinar-base-item', {minimal: this.props.isMinimal, unavailable: !this.props.item || !this.props.item.webinar});

		return (
			<div className={cls}>
				{this.renderDate()}
				{this.renderContents()}
			</div>
		);
	}
}
