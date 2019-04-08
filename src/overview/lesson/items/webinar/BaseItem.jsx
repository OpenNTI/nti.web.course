import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {isFlag} from '@nti/web-client';
import {Calendar} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';
import {scoped} from '@nti/lib-locale';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';

import Button from './Button';
import Availability from './common/Availability';
import Duration from './common/Duration';

const t = scoped('course.overview.lesson.items.webinar.BaseItem', {
	unregister: 'Un-Register',
	noLongerAvailable: 'This webinar is no longer available',
	incomplete: 'Incomplete'
});

export default class WebinarBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool,
		hideControls: PropTypes.bool,
		editMode: PropTypes.bool,
		readOnly: PropTypes.bool,
		onRequirementChange: PropTypes.func
	}


	state = {}


	componentDidMount () {
		this.unsubscribe = () => {};

		if (typeof document !== 'undefined' && isFlag('webinar-unregister-shiftkey')) {
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
		const startDate = nearestSession.getStartTime();

		return (
			<Calendar.DateIcon minimal className="date" date={startDate}>
				{item.hasCompleted() && isMinimal && <CircularProgress width={20} height={20} isComplete/>}
			</Calendar.DateIcon>
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

	renderContents () {
		const {item, item: {webinar}, isMinimal, hideControls, editMode, readOnly} = this.props;
		const nearestSession = webinar.getNearestSession();
		const startDate = nearestSession && nearestSession.getStartTime();
		const endDate = nearestSession && nearestSession.getEndTime();

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{webinar ? webinar.subject : t('noLongerAvailable')}</div>
					<Availability
						startTime={startDate}
						endTime={endDate}
						icon={item.icon}
						completed={item.hasCompleted()}
						minimal={isMinimal}
					/>
				</div>
				{!readOnly && !hideControls && !editMode && this.renderButton()}
				{webinar && !isMinimal && this.renderImageAndDescription()}
			</div>
		);
	}

	onStatusChange = (status) => {
		if(this.state.status !== status) {
			this.setState({status});

			this.props.item.webinar.refresh()
				.catch(() => {
				// need to do anything on failure?  We need to set the state so we don't keep trying to refresh
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
