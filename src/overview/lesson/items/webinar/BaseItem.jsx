import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import cx from 'classnames';

export default class WebinarBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool
	}


	state = {}


	renderDate () {
		const {item} = this.props;
		const {webinar} = item;
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

		return (
			<div className="image-and-description">
				<div className="image"/>
				<div className="description">{webinar.description}</div>
			</div>
		);
	}


	renderContents () {
		const {item, isMinimal} = this.props;
		const {webinar} = item;
		const nearestSession = webinar.getNearestSession();

		const timeDisplay = DateTime.format(nearestSession.getStartTime(), '[Available] dddd [from] hh:mm a')
			+ ' - ' + DateTime.format(nearestSession.getEndTime(), 'dddd [from] hh:mm a z');

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{webinar.subject}</div>
					<div className="time-info">{timeDisplay}</div>
				</div>
				{this.renderButton()}
				{!isMinimal && this.renderImageAndDescription()}
			</div>
		);
	}


	renderButton () {
		//TODO: Render different buttons based on webinar state...
		//TODO: Render null if expired
		//TODO:  Join button if registeded
		//TODO:  Register button if not registered
		return this.renderRegisterButton();
	}


	renderJoinButton () {
		// Join button is disabled if not available yet,
		// renders a timer when within 1hour of expiry
	}


	renderRegisterButton () {
		const {props: {item}, state: {register}} = this;
		const toggle = x => this.setState({register: !!x});
		const open = () => toggle(true);
		const close = () => toggle(false);

		return (
			<React.Fragment>
				<button onClick={open} disabled={register}>Register</button>
				{register && (
					<GotoWebinar.Registration item={item} onBeforeDismiss={close}/>
				)}
			</React.Fragment>
		);
	}


	render () {
		const cls = cx('webinar-base-item', {minimal: this.props.isMinimal});

		return (
			<div className={cls}>
				{this.renderDate()}
				{this.renderContents()}
			</div>
		);
	}
}
