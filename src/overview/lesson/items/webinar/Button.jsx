import React from 'react';
import PropTypes from 'prop-types';
import {Timer, DateTime, Layouts} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import StateStore, {States} from './Store';

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

const BUTTON_TRANSITION_TIME = 3000;

export default
@StateStore.connect({
	currentState: 'currentState',
	remainingTime: 'remainingTime'
})
class Button extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired,
		onStatusChange: PropTypes.func,
		store: PropTypes.object,
		remainingTime: PropTypes.number,
		currentState: PropTypes.string
	}

	state = {}


	componentDidMount () {
		const {store, onStatusChange, item: {webinar}} = this.props;

		store.calculateState(webinar, onStatusChange);
	}


	onTick = (clock) => {
		const {store} = this.props;

		store.onTick(clock);
	}


	renderJoinContents (enabled) {
		const {currentState, remainingTime} = this.props;

		let buttonContents = (<span>{t('join')}</span>);
		let additionalCls = null;

		if(currentState === States.RegisteredStartingSoon) {
			additionalCls = 'starting';

			buttonContents = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<Timer onTick={this.onTick}>
						<div>
							<span className="timer"/>
							<span className="remaining">{DateTime.getShortNaturalDuration(remainingTime)}</span>
						</div>
					</Timer>
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
				<Timer onTick={this.onTick}>
					<div>
						<div>{t('join')}</div>
						<div className="remaining">
							{t('expiresIn', {timeLeft: DateTime.formatDuration(remainingTime / 1000)})}
						</div>
					</div>
				</Timer>
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
		const close = () => {
			toggle(false);
			this.props.store.calculateState();
		};

		const {currentState, remainingTime} = this.props;

		let buttonLabel = t('register');

		if (currentState === States.UnregisteredStartingSoon) {
			buttonLabel = (
				<Layouts.Carousel transition={Layouts.Carousel.ROTATE_UP} interval={BUTTON_TRANSITION_TIME} active={0} wrap>
					<Timer onTick={this.onTick}>
						<div className="register-timer">
							<span className="timer"/>
							<span className="remaining">
								{DateTime.getShortNaturalDuration(remainingTime)}
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
		const {currentState} = this.props;

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
