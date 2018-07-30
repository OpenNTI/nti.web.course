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
	UnregisteredStartingInMinute: 'unregistered-starting-in-minute',
	RegisteredInactive: 'registered-inactive',
	RegisteredStartingSoon: 'registered-starting-soon',
	RegisteredStartingInMinute: 'registered-starting-in-minute',
	RegisteredActive: 'registered-active',
	RegisteredExpiringSoon: 'registered-expiring-soon',
	Expired: 'expired'
};

const UnregisteredStates = new Set([
	States.Unregistered,
	States.UnregisteredStartingSoon,
	States.UnregisteredStartingInMinute
]);

const COUNTDOWN_THRESHOLD = 1000 * 60 * 60; // one hour
const MINUTE_THRESHOLD = 1000 * 60;
const BUTTON_TRANSITION_TIME = 3000;

export default class Button extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired,
		onStatusChange: PropTypes.func
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props) {
		const {item: {webinar}, onStatusChange} = props;

		let newState = null;

		if(webinar && !webinar.isExpired() && !webinar.isJoinable() && webinar.hasLink('WebinarRegistrationFields')) {
			// the webinar hasn't expired and has registration fields, meaning we it's available for registration
			newState = this.handleUnregisteredStates(props);
		}
		else {
			newState = this.handleRegisteredStates(props);
		}

		if(newState) {
			this.setState(newState, () => {
				if(onStatusChange) {
					onStatusChange(this.state.currentState);
				}
			});
		}
	}

	// only allow one timeout any given time
	schedule (fn, timeout) {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(fn, timeout);
	}

	handleRegisteredStates (props) {
		//TODO: We should find a way to simplify this.
		const {item: {webinar}} = props;

		const nearestSession = webinar.getNearestSession();
		const now = Date.now();
		let newState = null;

		if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - MINUTE_THRESHOLD) < now) {
			// the webinar hasn't started and is within the threshold of showing a 'Starting' label
			newState = {
				currentState: States.RegisteredStartingInMinute
			};

			// after the minute threshold has passed before starting, trigger a recalculation
			this.schedule(() => {
				this.setupFor(this.props);
			}, Math.min(MINUTE_THRESHOLD, nearestSession.getStartTime() - now));
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) >= now) {
			// the webinar hasn't started and we're still too far out of the range for showing the countdown
			newState = {
				currentState: States.RegisteredInactive
			};

			const timeoutLength = nearestSession.getStartTime() - COUNTDOWN_THRESHOLD - now;

			// when the right amount of time has passed, recalculate the state as we should move us to the registered starting soon state
			this.schedule(() => {
				this.setupFor(this.props);
			}, timeoutLength);
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) < now) {
			// the webinar hasn't started but we're within the countdown threshold, so show the countdown timer on the button
			newState = {
				currentState: States.RegisteredStartingSoon,
				remainingTime: nearestSession.getStartTime() - now
			};
		}
		else if(nearestSession.getEndTime() < now) {
			// the webinar has expired
			newState = {
				currentState: States.Expired
			};
		}
		else if(nearestSession.getEndTime() - COUNTDOWN_THRESHOLD < now) {
			// the webinar's end time is within the countdown threshold, so show the countdown to expiration timer on the button
			newState = {
				currentState: States.RegisteredExpiringSoon,
				remainingTime: nearestSession.getEndTime() - now
			};
		}
		else if(nearestSession.getStartTime() < now && (nearestSession.getEndTime() - COUNTDOWN_THRESHOLD) > now) {
			// the webinar's end time is still too far out of the range for showing the countdown, so just show a 'Join' label in the meantime
			newState = {
				currentState: States.RegisteredActive
			};

			const timeoutLength = nearestSession.getEndTime() - COUNTDOWN_THRESHOLD - now;

			// when the right amount of time has passed, recalculate the state as we should move us to the registered expiring soon state
			this.schedule(() => {
				this.setupFor(this.props);
			}, timeoutLength);
		}

		return newState;
	}


	handleUnregisteredStates (props) {
		//TODO: We should find a way to simplify this.
		const {item: {webinar}} = props;

		const nearestSession = webinar.getNearestSession();
		const now = Date.now();

		let newState = null;

		// the webinar hasn't expired and has registration fields, meaning we it's available for registration
		if (nearestSession.getStartTime() > now && (nearestSession.getStartTime() - MINUTE_THRESHOLD) < now) {
			// the webinar is starting within the minute threshold, so show a Register/Starting message
			newState = {
				currentState: States.UnregisteredStartingInMinute
			};

			//FIXME: all timeouts in this component should be tracked and canceled before new timeouts are issued.

			// after the minute threshold has passed before starting, trigger a recalculation
			this.schedule(() => {
				this.setupFor(this.props);
			}, Math.min(MINUTE_THRESHOLD, nearestSession.getStartTime() - now));
		}
		else if(nearestSession.getStartTime() > now && (nearestSession.getStartTime() - COUNTDOWN_THRESHOLD) < now) {
			// the webinar will start soon, show timer and Register label
			newState = {
				currentState: States.UnregisteredStartingSoon,
				remainingTime: nearestSession.getStartTime() - now
			};
		}
		else {
			// the webinar will not start soon, just show Register label
			newState = {
				currentState: States.Unregistered
			};

			const timeoutLength = nearestSession.getStartTime() - COUNTDOWN_THRESHOLD - now;

			// when the right amount of time has passed, recalculate the state as we should move us to the unregistered starting soon state
			this.schedule(() => {
				this.setupFor(this.props);
			}, timeoutLength);
		}

		return newState;
	}


	onTick = (clock) => {
		const {item:{webinar}} = this.props;
		const {currentState} = this.state;

		const targetTime = currentState === States.RegisteredStartingSoon || currentState === States.UnregisteredStartingSoon
			? webinar.getNearestSession().getStartTime()
			: webinar.getNearestSession().getEndTime();

		const remainingTime = targetTime - clock.current;

		if(remainingTime <= 0
				|| (currentState === States.RegisteredStartingSoon
				|| currentState === States.UnregisteredStartingSoon
				&& remainingTime <= MINUTE_THRESHOLD)) {
			this.setupFor(this.props);
		}
		else {
			this.setState({remainingTime: targetTime - clock.current});
		}
	}


	renderJoinContents (enabled) {
		const {currentState} = this.state;

		//TODO: We should find a way to simplify this.
		if(currentState === States.RegisteredActive || currentState === States.RegisteredInactive) {
			return (
				<button className="join" disabled={!enabled}>
					<span>{t('join')}</span>
				</button>
			);
		}
		else if(currentState === States.RegisteredStartingSoon || currentState === States.RegisteredStartingInMinute) {
			return (
				<button className="join starting" disabled={!enabled}>
					{currentState === States.RegisteredStartingSoon && (
						<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
							<Timer onTick={this.onTick}>
								<div>
									<span className="timer"/>
									<span className="remaining">{DateTime.getShortNaturalDuration(this.state.remainingTime)}</span>
								</div>
							</Timer>
							<div>{t('join')}</div>
						</Layouts.Carousel>
					)}
					{currentState === States.RegisteredStartingInMinute && (
						<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
							<div>{t('starting')}</div>
							<div>{t('join')}</div>
						</Layouts.Carousel>
					)}
				</button>
			);
		}
		else if(currentState === States.RegisteredExpiringSoon) {
			return (
				<button className="join expiring" disabled={!enabled}>
					<Timer onTick={this.onTick}>
						<div>
							<div>{t('join')}</div>
							<div className="remaining">
								Expires in {DateTime.formatDuration(this.state.remainingTime / 1000)}
							</div>
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
			<a target="_blank" rel="noopener noreferrer" href={enabled ? webinar.getLink('JoinWebinar') : null}>
				{this.renderJoinContents(enabled)}
			</a>
		);
	}


	renderRegisterButton () {
		const {props: {item}, state: {register}} = this;
		const toggle = x => this.setState({register: !!x});
		const open = () => toggle(true);
		const close = () => toggle(false);

		const {currentState} = this.state;

		let buttonLabel = t('register');

		if (currentState === States.UnregisteredStartingSoon) {
			buttonLabel = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<Timer onTick={this.onTick}>
						<div className="register-timer">
							<span className="timer"/>
							<span className="remaining">
								{DateTime.getShortNaturalDuration(this.state.remainingTime)}
							</span>
						</div>
					</Timer>
					<div className="register-label">{t('register')}</div>
				</Layouts.Carousel>
			);
		}

		else if (currentState === States.UnregisteredStartingInMinute) {
			buttonLabel = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<div className="register-label">{t('starting')}</div>
					<div className="register-label">{t('register')}</div>
				</Layouts.Carousel>
			);
		}

		return (
			<React.Fragment>
				<button onClick={open} disabled={register}>{buttonLabel}</button>
				{register && (
					<GotoWebinar.Registration item={item} onBeforeDismiss={close}/>
				)}
			</React.Fragment>
		);
	}


	render () {
		const {currentState} = this.state;

		if(UnregisteredStates.has(currentState)) {
			return this.renderRegisterButton();
		}
		else if(currentState && currentState !== States.Expired) {
			return this.renderJoinButton();
		}

		// didn't match a state or is expired, show nothing
		return null;
	}
}
