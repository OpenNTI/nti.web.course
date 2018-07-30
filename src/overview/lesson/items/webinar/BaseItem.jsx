import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';

import Button from './Button';
import Duration from './common/Duration';

const t = scoped('course.overview.lesson.items.webinar.BaseItem', {
	unregister: 'Un-Register',
	noLongerAvailable: 'This webinar is no longer available',
	completed: 'Completed',
	incomplete: 'Incomplete',
	absent: 'Absent'
});

export default class WebinarBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool,
		hideControls: PropTypes.bool,
		editMode: PropTypes.bool,
		onRequirementChange: PropTypes.func
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
		const {item, isMinimal} = this.props;
		const {webinar} = item;

		if(!webinar) {
			return null;
		}

		const nearestSession = webinar.getNearestSession();

		return (
			<div className="date">
				<div className="month">{DateTime.format(nearestSession.getStartTime(), 'MMM')}</div>
				<div className="day">{nearestSession.getStartTime().getDate()}</div>
				{item.hasCompleted() && isMinimal && <CircularProgress width={20} height={20} isComplete/>}
			</div>
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
				<div className={cx('duration-container', {'is-active': isAvailable})}><Duration webinar={webinar}/></div>
			</div>
		);
	}

	renderImageAndDescription () {
		const {item} = this.props;
		const {webinar} = item;

		const hasIcon = item.icon && item.icon !== 'null';

		return (
			<div className={cx('image-and-description', {iconless: !hasIcon})}>
				{hasIcon && <div className="image"><img src={item.icon}/>{this.renderStatus()}</div>}
				<pre className="description">{webinar.description}</pre>
			</div>
		);
	}

	isToday (a, b) {
		return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
	}

	renderAvailability () {
		const {item, isMinimal, item: {webinar}} = this.props;
		const nearestSession = webinar && webinar.getNearestSession();

		const now = Date.now();

		// default case, render 'Available [day] from [startTime] - [endTime]'
		let timeDisplay = nearestSession && DateTime.format(nearestSession.getStartTime(), '[Available] dddd [from] hh:mm a')
			+ ' - ' + DateTime.format(nearestSession.getEndTime(), 'hh:mm a z');

		if(webinar.isExpired()) {
			// render 'Expired [day] at [time]'
			timeDisplay = nearestSession && DateTime.format(nearestSession.getEndTime(), '[Expired] dddd [at] hh:mm a z');
		}
		else {
			const currDate = new Date(now);

			// determine if it's today
			if(this.isToday(currDate, nearestSession.getStartTime())) {
				timeDisplay = nearestSession && DateTime.format(nearestSession.getStartTime(), '[Available Today at] hh:mm a z');

				/*
				// This is logic for the simulated live case which we aren't worrying about now
				const msUntilExpiration = nearestSession.getEndTime() - now;

				if(msUntilExpiration <= 60 * 60 * 1000) {
					// expires within an hour, render 'Expires Today at [time]'
					timeDisplay = nearestSession && DateTime.format(nearestSession.getEndTime(), '[Expires Today at] hh:mm a z');
				}
				else {
					// render 'Available Today at [time]'
					timeDisplay = nearestSession && DateTime.format(nearestSession.getStartTime(), '[Available Today at] hh:mm a z');
				}
				*/
			}
		}

		return (
			<div className="availability-info">
				{item.hasCompleted() && !isMinimal && <CircularProgress width={20} height={20} isComplete/>}
				{item.hasCompleted() && <div className="completion-label">{t('completed')}</div>}
				{!item.hasCompleted() && webinar.isExpired() && <div className="incomplete-label">{t('absent')}</div>}
				{(!item.icon || isMinimal) && !webinar.isExpired() && <Duration webinar={webinar}/>}
				<div className="time-display">{timeDisplay}</div>
			</div>
		);
	}


	renderContents () {
		const {item: {webinar}, isMinimal, hideControls, editMode} = this.props;

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{webinar ? webinar.subject : t('noLongerAvailable')}</div>
					{this.renderAvailability()}
				</div>
				{!hideControls && !editMode && this.renderButton()}
				{webinar && !isMinimal && this.renderImageAndDescription()}
			</div>
		);
	}

	onStatusChange = (status) => {
		if(this.state.status !== status) {
			this.props.item.webinar.refresh().then(() => {
				this.setState({status});
			});
		}
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

		if(webinar && !webinar.isExpired()) {
			// user has already registered for the webinar, show join button
			if(webinar.isJoinable()) {

				if (webinar.hasLink('WebinarUnRegister') && isModifierOn(keysDown)) {
					return this.renderUnRegisterButton();
				}
			}
		}

		return <Button item={this.props.item} onStatusChange={this.onStatusChange}/>;
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
		const {item, isMinimal, onRequirementChange} = this.props;

		const cls = cx('webinar-base-item', {expired: item.webinar.isExpired(), minimal: isMinimal, unavailable: !item || !item.webinar});

		const required = item.CompletionRequired;

		return (
			<div className={cls}>
				{this.renderDate()}
				{this.renderContents()}
				{item && item.isCompletable && item.isCompletable() && onRequirementChange ? (
					<RequirementControl record={item} onChange={onRequirementChange}/>
				) : required && (
					<Required key="required-label"/>
				)}
			</div>
		);
	}
}
