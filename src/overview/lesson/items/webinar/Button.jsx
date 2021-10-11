import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Timer, DateTime, Layouts, HOC } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import { GotoWebinar } from '@nti/web-integrations';
import { scoped } from '@nti/lib-locale';

import styles from './Button.css';
import StateManager, { States } from './StateManager';

const cx = classnames.bind(styles);

const t = scoped('course.overview.lesson.items.webinar.Button', {
	register: 'Register',
	unregister: 'Un-Register',
	join: 'Join',
	starting: 'Starting',
	expiresIn: 'Expires in %(timeLeft)s',
});

const UnregisteredStates = new Set([
	States.Unregistered,
	States.UnregisteredStartingSoon,
	States.UnregisteredStartingInMinute,
]);

const TimedStates = new Set([
	States.RegisteredExpiringSoon,
	States.UnregisteredStartingSoon,
	States.RegisteredStartingSoon,
]);

const BUTTON_TRANSITION_TIME = 3000;

export default class WebinarButton extends React.Component {
	static propTypes = {
		webinar: PropTypes.object.isRequired,
		onStatusChange: PropTypes.func,
		onUnregister: PropTypes.func,
	};

	state = {};

	constructor(props) {
		super(props);

		this.stateManager = new StateManager(
			props.webinar,
			props.onStatusChange
		);
	}

	componentDidMount() {
		this.stateManager.calculateState();

		document?.addEventListener('keydown', this.onGlobalKeyPress);
		document?.addEventListener('keyup', this.onGlobalKeyPress);
		this.unsubscribe = () => {
			document?.removeEventListener('keydown', this.onGlobalKeyPress);
			document?.removeEventListener('keyup', this.onGlobalKeyPress);
		};
	}

	componentWillUnmount() {
		this.unsubscribe?.();
	}

	onGlobalKeyPress = ({ type, key }) => {
		const keys = new Set([...(this.state.keysDown || [])]);
		keys[type === 'keydown' ? 'add' : 'delete'](key);

		this.setState({
			keysDown: [...keys],
		});
	};

	onTick = clock => {
		this.stateManager.onTick(clock);
	};

	renderJoinContents(enabled, disabledButNotReally) {
		const { currentState, remainingTime } = this.state;

		let buttonContents = <span>{t('join')}</span>;
		let additionalCls = null;

		if (currentState === States.RegisteredStartingSoon) {
			additionalCls = 'starting';

			buttonContents = (
				<Layouts.Carousel
					transition={Layouts.Carousel.ROTATE_UP}
					interval={BUTTON_TRANSITION_TIME}
					active={0}
					wrap
				>
					<div>
						<span className={cx('timer')} />
						<span className={cx('remaining')}>
							{DateTime.getShortNaturalDuration(remainingTime)}
						</span>
					</div>
					<div>{t('join')}</div>
				</Layouts.Carousel>
			);
		} else if (currentState === States.RegisteredStartingInMinute) {
			additionalCls = 'starting';

			buttonContents = (
				<Layouts.Carousel
					transition={Layouts.Carousel.ROTATE_UP}
					interval={BUTTON_TRANSITION_TIME}
					active={0}
					wrap
				>
					<div>{t('starting')}</div>
					<div>{t('join')}</div>
				</Layouts.Carousel>
			);
		} else if (currentState === States.RegisteredExpiringSoon) {
			additionalCls = 'expiring';

			buttonContents = (
				<div>
					<div>{t('join')}</div>
					<div className={cx('remaining')}>
						{t('expiresIn', {
							timeLeft: DateTime.formatDuration(
								remainingTime / 1000
							),
						})}
					</div>
				</div>
			);
		}

		return (
			<Button
				rounded
				constructive
				className={cx('join', additionalCls, {
					clickable: disabledButNotReally,
					disabled: !enabled,
				})}
			>
				{buttonContents}
			</Button>
		);
	}

	renderJoinButton() {
		const { webinar } = this.props;
		const { currentState } = this.state;

		const enabled =
			currentState !== States.RegisteredInactive && webinar.isJoinable();
		const disabledButNotReally = currentState === States.RegisteredInactive;

		return (
			<a
				target="_blank"
				rel="noopener noreferrer"
				href={
					enabled || disabledButNotReally
						? webinar.getLink('JoinWebinar')
						: null
				}
			>
				{this.renderTimerIfNecessary()}
				{this.renderJoinContents(enabled, disabledButNotReally)}
			</a>
		);
	}

	renderRegisterButton() {
		const {
			props: { webinar },
			state: { register },
		} = this;
		const toggle = x => this.setState({ register: !!x });
		const open = () => toggle(true);
		const close = () => {
			toggle(false);
			this.stateManager.calculateState();
		};

		const { currentState, remainingTime } = this.state;

		let buttonLabel = t('register');

		if (currentState === States.UnregisteredStartingSoon) {
			buttonLabel = (
				<Layouts.Carousel
					transition={Layouts.Carousel.ROTATE_UP}
					interval={BUTTON_TRANSITION_TIME}
					active={0}
					wrap
				>
					<div className={cx('register-timer')}>
						<span className={cx('timer')} />
						<span className={cx('remaining')}>
							{DateTime.getShortNaturalDuration(remainingTime)}
						</span>
					</div>
					<div className={cx('register-label')}>{t('register')}</div>
				</Layouts.Carousel>
			);
		} else if (currentState === States.UnregisteredStartingInMinute) {
			buttonLabel = (
				<Layouts.Carousel
					transition={Layouts.Carousel.ROTATE_UP}
					interval={BUTTON_TRANSITION_TIME}
					active={0}
					wrap
				>
					<div className={cx('register-label')}>{t('starting')}</div>
					<div className={cx('register-label')}>{t('register')}</div>
				</Layouts.Carousel>
			);
		}

		return (
			<React.Fragment>
				{this.renderTimerIfNecessary()}
				<Button onClick={open} disabled={register}>
					{buttonLabel}
				</Button>
				{register && (
					<GotoWebinar.Registration
						item={{ webinar }}
						onBeforeDismiss={close}
					/>
				)}
			</React.Fragment>
		);
	}

	renderTimerIfNecessary() {
		if (TimedStates.has(this.state.currentState)) {
			return <Timer onTick={this.onTick} />;
		}
	}

	onManagerChange = () => {
		const {
			stateManager: { currentState, remainingTime },
		} = this;

		this.setState({
			currentState,
			remainingTime,
		});
	};

	renderUnRegisterButton() {
		const unregister = () => {
			const { webinar, onUnregister } = this.props;

			webinar
				.deleteLink('WebinarUnRegister')
				.then(() => webinar.refresh())
				.then(() => onUnregister && onUnregister());
		};

		return (
			<button className={cx('caution')} onClick={unregister}>
				{t('unregister')}
			</button>
		);
	}

	render() {
		const {
			props: { webinar, className } = {},
			state: { currentState, keysDown },
		} = this;

		let body = null;

		const isModifierOn = x => /^shift$/i.test((keysDown || []).join('-'));

		if (UnregisteredStates.has(currentState)) {
			body = this.renderRegisterButton();
		} else if (currentState && currentState !== States.Expired) {
			if (
				webinar.hasLink('WebinarUnRegister') &&
				isModifierOn(keysDown)
			) {
				body = this.renderUnRegisterButton();
			} else {
				body = this.renderJoinButton();
			}
		}

		return (
			<span className={cx('webinar-button-container', className)}>
				{this.renderTimerIfNecessary()}
				<HOC.ItemChanges
					item={this.stateManager}
					onItemChanged={this.onManagerChange}
				/>
				{body}
			</span>
		);
	}
}
