import React from 'react';
import PropTypes from 'prop-types';
import {Timer, DateTime, Layouts} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.items.webinar.Button', {
	register: 'Register',
	unregister: 'Un-Register',
	join: 'Join',
	starting: 'Starting'
});

const States = {
	Unregistered: 'unregistered',
	UnregisteredStartingSoon: 'unregistered-starting-soon',
	RegisteredInactive: 'registered-inactive',
	RegisteredStartingSoon: 'registered-starting-soon',
	RegisteredStartingInMinute: 'registered-starting-in-minute',
	RegisteredActive: 'registered-active',
	RegisteredExpiringSoon: 'registered-expiring-soon',
	Expired: 'expired'
};

const COUNTDOWN_THRESHOLD = 1000 * 60 * 60; // one hour
const MINUTE_THRESHOLD = 1000 * 60;
const BUTTON_TRANSITION_TIME = 5000;

export default class Button extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}

	setupFor (props) {
		const {item: {webinar}} = props;

		const nearestSession = webinar.getNearestSession();
		const now = Date.now();

		let currentState = null;
		let remainingTime = 0;

		if(webinar && !webinar.isExpired() && !webinar.isJoinable() && webinar.hasLink('WebinarRegistrationFields')) {
			// the webinar hasn't expired and has registration fields, meaning we it's available for registration
			if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) < now) {
				// the webinar will start soon, show timer and Register label
				currentState = States.UnregisteredStartingSoon;
				remainingTime = nearestSession.getStartTime() - now;
			}
			else {
				// the webinar will not start soon, just show Register label
				currentState = States.Unregistered;

				const timeoutLength = nearestSession.getStartTime() - COUNTDOWN_THRESHOLD - now;

				// when the right amount of time has passed, recalculate the state as we should move us to the unregistered starting soon state
				setTimeout(() => {
					this.setupFor(this.props);
				}, timeoutLength);
			}
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - MINUTE_THRESHOLD) < now) {
			// the webinar hasn't started and is within the threshold of showing a 'Starting' label
			currentState = States.RegisteredStartingInMinute;

			// after the minute threshold has passed before starting, trigger a recalculation
			setTimeout(() => {
				this.setupFor(this.props);
			}, Math.min(MINUTE_THRESHOLD, nearestSession.getStartTime() - now));
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) >= now) {
			// the webinar hasn't started and we're still too far out of the range for showing the countdown
			currentState = States.RegisteredInactive;

			const timeoutLength = nearestSession.getStartTime() - COUNTDOWN_THRESHOLD - now;

			// when the right amount of time has passed, recalculate the state as we should move us to the registered starting soon state
			setTimeout(() => {
				this.setupFor(this.props);
			}, timeoutLength);
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) < now) {
			// the webinar hasn't started but we're within the countdown threshold, so show the countdown timer on the button
			currentState = States.RegisteredStartingSoon;
			remainingTime = nearestSession.getStartTime() - now;
		}
		else if(nearestSession.getEndTime() < now) {
			// the webinar has expired
			currentState = States.Expired;
		}
		else if(nearestSession.getEndTime() - COUNTDOWN_THRESHOLD < now) {
			// the webinar's end time is within the countdown threshold, so show the countdown to expiration timer on the button
			currentState = States.RegisteredExpiringSoon;
			remainingTime = nearestSession.getEndTime() - now;
		}
		else if(nearestSession.getStartTime() < now && (nearestSession.getEndTime() - COUNTDOWN_THRESHOLD) > now) {
			// the webinar's end time is still too far out of the range for showing the countdown, so just show a 'Join' label in the meantime
			currentState = States.RegisteredActive;

			const timeoutLength = nearestSession.getEndTime() - COUNTDOWN_THRESHOLD - now;

			// when the right amount of time has passed, recalculate the state as we should move us to the registered expiring soon state
			setTimeout(() => {
				this.setupFor(this.props);
			}, timeoutLength);
		}

		this.setState({currentState, remainingTime});
	}

	onTick = (clock) => {
		const {item:{webinar}} = this.props;

		const targetTime = this.state.currentState === States.RegisteredStartingSoon || this.state.currentState === States.UnregisteredStartingSoon
			? webinar.getNearestSession().getStartTime()
			: webinar.getNearestSession().getEndTime();

		const remainingTime = targetTime - clock.current;

		if(remainingTime <= 0 || (this.state.currentState === States.RegisteredStartingSoon && remainingTime <= MINUTE_THRESHOLD)) {
			this.setupFor(this.props);
		}
		else {
			this.setState({remainingTime: targetTime - clock.current});
		}
	}

	renderJoinContents (enabled) {
		const {currentState} = this.state;

		if(currentState === States.RegisteredActive || currentState === States.RegisteredInactive) {
			return (
				<button className="join" disabled={!enabled}>
					<span>{t('join')}</span>
				</button>
			);
		}
		else if(currentState === States.RegisteredStartingInMinute) {
			return (
				<button className="join starting" disabled={!enabled}>
					<span>{t('starting')}</span>
				</button>
			);
		}
		else if(currentState === States.RegisteredStartingSoon) {
			return (
				<button className="join starting" disabled={!enabled}>
					<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
						<Timer onTick={this.onTick}>
							<span>
								<span className="timer"/>
								<span className="remaining">{DateTime.getShortNaturalDuration(this.state.remainingTime)}</span>
							</span>
						</Timer>
						<span>{t('join')}</span>
					</Layouts.Carousel>
				</button>
			);
		}
		else if(currentState === States.RegisteredExpiringSoon) {
			return (
				<button className="join expiring" disabled={!enabled}>
					<Timer onTick={this.onTick}>
						<div>
							<div>{t('join')}</div>
							<div className="remaining">Expires in {DateTime.formatDuration(this.state.remainingTime / 1000)}</div>
						</div>
					</Timer>
				</button>
			);
		}
	}

	renderJoinButton () {
		const {item: {webinar}} = this.props;

		const enabled = webinar.isAvailable();

		return (
			<a target="_blank"
				rel="noopener noreferrer"
				href={enabled ? webinar.getLink('JoinWebinar') : null}
			>
				{this.renderJoinContents(enabled)}
			</a>
		);
	}


	renderRegisterButton () {
		const {props: {item}, state: {register}} = this;
		const toggle = x => this.setState({register: !!x});
		const open = () => toggle(true);
		const close = () => {
			toggle(false);

			// might be nicer to have a hook in the registration form that is called only on successful
			// registration so that we only refresh/setup on registration, not just close.  But this isn't too expensive for now
			this.props.item.refresh().then(() => {
				this.setupFor(this.props);
			});
		};

		const {currentState} = this.state;

		if(currentState === States.UnregisteredStartingSoon) {
			return (
				<React.Fragment>
					<button onClick={open} disabled={register}>
						<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
							<Timer onTick={this.onTick}>
								<span className="register-timer">
									<span className="timer"/>
									<span className="remaining">{DateTime.getShortNaturalDuration(this.state.remainingTime)}</span>
								</span>
							</Timer>
							<span className="register-label">{t('register')}</span>
						</Layouts.Carousel>
					</button>
					{register && (
						<GotoWebinar.Registration item={item} onBeforeDismiss={close}/>
					)}
				</React.Fragment>
			);
		}

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
		const {currentState} = this.state;

		if(currentState === States.Unregistered || currentState === States.UnregisteredStartingSoon) {
			return this.renderRegisterButton();
		}
		else if(currentState && currentState !== States.Expired) {
			return this.renderJoinButton();
		}

		// didn't match a state or is expired, show nothing
		return null;
	}
}
