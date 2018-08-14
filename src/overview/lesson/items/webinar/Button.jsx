import React from 'react';
import PropTypes from 'prop-types';
import {Timer, DateTime, Layouts, HOC} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import StateManager, {States} from './StateManager';

const t = scoped('course.overview.lesson.items.webinar.Button', {
	register: 'Register',
	join: 'Join',
	starting: 'Starting',
	expiresIn: 'Expires in %(timeLeft)s'
});

const UnregisteredStates = new Set([
	States.Unregistered,
	States.UnregisteredStartingSoon,
	States.UnregisteredStartingInMinute
]);

const TimedStates = new Set([
	States.RegisteredExpiringSoon,
	States.UnregisteredStartingSoon,
	States.RegisteredStartingSoon
]);

const BUTTON_TRANSITION_TIME = 3000;

export default class Button extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired,
		onStatusChange: PropTypes.func
	}

	state = {}

	constructor (props) {
		super(props);

		this.stateManager = new StateManager(props.item.webinar, props.onStatusChange);
	}


	componentDidMount () {
		this.stateManager.calculateState();
	}


	onTick = (clock) => {
		this.stateManager.onTick(clock);
	}


	renderJoinContents (enabled) {
		const {currentState, remainingTime} = this.state;

		let buttonContents = (<span>{t('join')}</span>);
		let additionalCls = null;

		if(currentState === States.RegisteredStartingSoon) {
			additionalCls = 'starting';

			buttonContents = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<div>
						<span className="timer"/>
						<span className="remaining">{DateTime.getShortNaturalDuration(remainingTime)}</span>
					</div>
					<div>{t('join')}</div>
				</Layouts.Carousel>
			);
		}
		else if(currentState === States.RegisteredStartingInMinute) {
			additionalCls = 'starting';

			buttonContents = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<div>{t('starting')}</div>
					<div>{t('join')}</div>
				</Layouts.Carousel>
			);
		}
		else if(currentState === States.RegisteredExpiringSoon) {
			additionalCls = 'expiring';

			buttonContents = (
				<div>
					<div>{t('join')}</div>
					<div className="remaining">
						{t('expiresIn', {timeLeft: DateTime.formatDuration(remainingTime / 1000)})}
					</div>
				</div>
			);
		}

		return (
			<button className={cx('join', additionalCls)} disabled={!enabled}>
				{buttonContents}
			</button>
		);
	}


	renderJoinButton () {
		const {item: {webinar}} = this.props;
		const {currentState} = this.state;

		const enabled = currentState !== States.RegisteredInactive && webinar.isJoinable();

		return (
			<a target="_blank" rel="noopener noreferrer" href={enabled ? webinar.getLink('JoinWebinar') : null}>
				{this.renderTimerIfNecessary()}
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
			this.stateManager.calculateState();
		};

		const {currentState, remainingTime} = this.state;

		let buttonLabel = t('register');

		if (currentState === States.UnregisteredStartingSoon) {
			buttonLabel = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<div className="register-timer">
						<span className="timer"/>
						<span className="remaining">
							{DateTime.getShortNaturalDuration(remainingTime)}
						</span>
					</div>
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
				{this.renderTimerIfNecessary()}
				<button onClick={open} disabled={register}>{buttonLabel}</button>
				{register && (
					<GotoWebinar.Registration item={item} onBeforeDismiss={close}/>
				)}
			</React.Fragment>
		);
	}

	renderTimerIfNecessary () {
		if(TimedStates.has(this.state.currentState)) {
			return (
				<Timer onTick={this.onTick}/>
			);
		}
	}

	onManagerChange = () => {
		this.setState({
			currentState: this.stateManager.currentState,
			remainingTime: this.stateManager.remainingTime
		});
	}


	render () {
		const {currentState} = this.state;

		let body = null;

		if(UnregisteredStates.has(currentState)) {
			body = this.renderRegisterButton();
		}
		else if(currentState && currentState !== States.Expired) {
			body = this.renderJoinButton();
		}

		return (
			<span>
				{this.renderTimerIfNecessary()}
				<HOC.ItemChanges item={this.stateManager} onItemChanged={this.onManagerChange}/>
				{body}
			</span>
		);
	}
}
