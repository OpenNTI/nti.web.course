import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import cx from 'classnames';

export default class WebinarBaseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		isMinimal: PropTypes.bool
	}

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
				{!isMinimal && this.renderImageAndDescription()}
			</div>
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
