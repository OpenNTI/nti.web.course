import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {GotoWebinar} from '@nti/web-integrations';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.items.webinar.BaseItem', {
	register: 'Register',
	unregister: 'Un-Register',
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


	componentDidMount () {
		this.unsubscribe = () => {};

		if (typeof document !== 'undefined') {
			document.addEventListener('keydown', this.onGlobalKeyPress);
			document.addEventListener('keyup', this.onGlobalKeyPress);
			this.unsubscribe = () => {
				document.removeEventListener('keydown', this.onGlobalKeyPress);
				document.removeEventListener('keyup', this.onGlobalKeyPress);
			};
		}
	}


	componentWillUnmount () {
		this.unsubscribe();
	}


	onGlobalKeyPress = ({type, key}) => {

		const keys = new Set([...(this.state.keysDown || [])]);

		const keysDown = [... keys[type === 'keydown' ? 'add' : 'delete'](key)].sort();

		this.setState({
			keysDown
		});
	}


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


	renderDuration () {
		const { item: {webinar}} = this.props;

		const duration = webinar.getDuration();

		const hours = Math.floor((duration / 1000) / 60 / 60);

		const minutes = ((duration) - (hours * 60 * 60 * 1000)) / 1000 / 60;

		return (
			<span className="duration">
				<span className="hour">{hours}HR</span>
				{minutes > 0 && <span className="minutes">{minutes}MIN</span>}
			</span>
		);
	}


	renderStatus () {
		const { item: {webinar}} = this.props;

		if(!webinar) {
			return null;
		}

		const isAvailable = webinar.isAvailable();

		return (
			<div className="status">
				{isAvailable && <div className="live">Live</div>}
				<div className={cx('duration-container', {'is-active': isAvailable})}>{this.renderDuration()}</div>
			</div>
		);
	}

	renderImageAndDescription () {
		const {item} = this.props;
		const {webinar} = item;

		return (
			<div className="image-and-description">
				{item.icon && item.icon !== 'null' && <div className="image"><img src={item.icon}/>{this.renderStatus()}</div>}
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
		const {
			props: {
				item: {
					webinar
				}
			},
			state: {
				keysDown
			}
		} = this;

		const isModifierOn = x => /^shift$/i.test((keysDown || []).join('-'));

		if(webinar) {
			// user has already registered for the webinar, show join button
			if(webinar.isJoinable()) {

				if (webinar.hasLink('WebinarUnRegister') && isModifierOn(keysDown)) {
					return this.renderUnRegisterButton();
				}


				return this.renderJoinButton();
			}

			else if (webinar.hasLink('WebinarRegistrationFields')) {
				// user has not registered, show register button
				return this.renderRegisterButton();
			}
		}


		return null;
	}


	renderJoinButton () {
		// TODO: Join button is disabled if not available yet,
		// TODO: render a timer when within 1hour of expiry

		const {item: {webinar}} = this.props;

		const enabled = webinar.isAvailable();

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


	renderUnRegisterButton () {
		const unregister = () => {
			const {webinar} = this.props.item;
			webinar.requestLink('WebinarUnRegister', 'delete')
				.then(() => webinar.refresh())
				.then(() => this.forceUpdate());
		};


		return (
			<button className="cation" onClick={unregister}>{t('unregister')}</button>
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
