import './BaseItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Event} from '@nti/web-calendar';
import {DateTime} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';

import Button from './Button';

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
		noProgress: PropTypes.bool,
		onRequirementChange: PropTypes.func
	}


	state = {}



	renderDate () {
		const {item, isMinimal, noProgress} = this.props;
		const {webinar} = item;

		if(!webinar) {
			return null;
		}

		const nearestSession = webinar.getNearestSession();
		const startDate = nearestSession.getStartTime();

		return (
			<DateTime.DateIcon minimal className="date" date={startDate}>
				{item.hasCompleted() && !noProgress && isMinimal && <CircularProgress width={20} height={20} isComplete/>}
			</DateTime.DateIcon>
		);
	}

	renderStatus (startTime, endTime) {
		const { item: {webinar}} = this.props;

		if(!webinar) {
			return null;
		}

		const isAvailable = webinar.isAvailable();

		return (
			<div className="status">
				{isAvailable && <div className="live">Live</div>}
				<div className={cx('duration-container', {'is-active': isAvailable})}><DateTime.Duration {...{startTime, endTime}}/></div>
			</div>
		);
	}

	renderImageAndDescription (startDate, endDate) {
		const {item} = this.props;
		const {webinar} = item;

		const hasIcon = item.icon && item.icon !== 'null';

		return (
			<div className={cx('image-and-description', {iconless: !hasIcon})}>
				{hasIcon && <div className="image"><img src={item.icon}/>{this.renderStatus(startDate, endDate)}</div>}
				<pre className="description">{webinar.description}</pre>
			</div>
		);
	}

	renderContents () {
		const {item, item: {webinar}, isMinimal, hideControls, noProgress, readOnly} = this.props;
		const nearestSession = webinar.getNearestSession();
		const startDate = nearestSession && nearestSession.getStartTime();
		const endDate = nearestSession && nearestSession.getEndTime();

		return (
			<div className="contents">
				<div className="header">
					<div className="title">{webinar ? webinar.subject : t('noLongerAvailable')}</div>
					<Event.Availability
						startTime={startDate}
						endTime={endDate}
						icon={item.icon}
						completed={!noProgress && item.hasCompleted()}
						minimal={isMinimal}
					/>
				</div>
				{!readOnly && !hideControls && !noProgress && <Button webinar={webinar} onStatusChange={this.onStatusChange} onUnregister={this.onUnregister} />}
				{webinar && !isMinimal && this.renderImageAndDescription(startDate, endDate)}
			</div>
		);
	}

	onUnregister = () => this.forceUpdate()

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

	render () {
		const {item, isMinimal, onRequirementChange, editMode} = this.props;

		const cls = cx('webinar-base-item', {expired: item.webinar.isExpired(), minimal: isMinimal, unavailable: !item || !item.webinar});

		const required = item.CompletionRequired;

		const Wrapper = editMode ? 'div' : props => <LinkTo.Object object={item} {...props} />;

		return (
			<Wrapper className={cls}>
				{this.renderDate()}
				{this.renderContents()}
				{item && item.isCompletable && item.isCompletable() && onRequirementChange ? (
					<RequirementControl record={item} onChange={onRequirementChange}/>
				) : required && (
					<Required key="required-label"/>
				)}
			</Wrapper>
		);
	}
}
