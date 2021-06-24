import './BaseItem.scss';
import React, { useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { DateTime, useForceUpdate } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { Hooks, Events } from '@nti/web-session';

import CompleteIcon from '../../common/GridCompleteIcon';
import Required from '../../common/Required';
import RequirementControl from '../../../../progress/widgets/RequirementControl';

const floatRight = css`
	float: right;
`;

function isToday(a, b) {
	return (
		a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear()
	);
}

const t = scoped('course.overview.lesson.items.event.Base', {
	endsAt: 'Ends %(date)s at %(time)s',
	startsAt: 'Starts %(weekday)s at %(time)s',
	startsFrom: 'Starts %(weekday)s from %(time)s',
});

const endsAt = f =>
	t('endsAt', {
		date: f(DateTime.WEEKDAY_MONTH_NAME_DAY_YEAR),
		time: f(DateTime.TIME_PADDED_WITH_ZONE),
	});
const startsAt = f =>
	t('startsAt', {
		weekday: f(DateTime.WEEKDAY),
		time: f(DateTime.TIME_PADDED),
	});
const startsFrom = f =>
	t('startsFrom', {
		weekday: f(DateTime.WEEKDAY),
		time: f(DateTime.TIME_PADDED),
	});

const EventBaseItem = React.forwardRef(
	({ item, isMinimal, editMode, ...props }, ref) => {
		const forceUpdate = useForceUpdate();
		useImperativeHandle(
			ref,
			() => ({
				async onEventUpdated(newEvent) {
					const { CalendarEvent: event } = item;

					if (event.NTIID === newEvent.NTIID) {
						await event.refresh(newEvent);
						forceUpdate();
					}
				},
			}),
			[item, forceUpdate]
		);

		const Wrapper = editMode
			? 'div'
			: props => <LinkTo.Object object={item} {...props} />;

		const cls = cx('event-base-item', {
			minimal: isMinimal,
			unavailable: !item || !item.event,
		});

		return (
			<Wrapper className={cls}>
				<Date item={item} minimal={isMinimal} />

				<Contents
					item={item}
					isMinimal={isMinimal}
					editMode={editMode}
					{...props}
				/>
			</Wrapper>
		);
	}
);

EventBaseItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	isMinimal: PropTypes.bool,
	hideControls: PropTypes.bool,
	editMode: PropTypes.bool,
	onRequirementChange: PropTypes.func,
};

export default Hooks.onEvent(
	Events.EVENT_UPDATED,
	'onEventUpdated'
)(EventBaseItem);

const CompletionBox = styled.div`
	flex: 0 0 auto;
	text-align: center;
	width: 75px;

	&.minimal {
		width: 80px;
	}
`;

function CompleteStatus({ item, children }) {
	const failed = item?.CompletedItem && !item.CompletedItem.Success;
	const completed =
		item && item.hasCompleted && item.hasCompleted() && !failed;
	return (
		<CompletionBox>{completed ? <CompleteIcon /> : children}</CompletionBox>
	);
}

function RequiredControl({ onRequirementChange, item }) {
	const required = item.CompletionRequired;
	return onRequirementChange && item.isCompletable?.() ? (
		<RequirementControl
			record={item}
			onChange={onRequirementChange}
			className={floatRight}
		/>
	) : required ? (
		<Required className={floatRight} />
	) : null;
}

function Date({ item, minimal }) {
	const { CalendarEvent: event } = item;

	if (!event) {
		return null;
	}

	return (
		<CompleteStatus item={item} minimal={minimal}>
			<DateTime.DateIcon
				className="date"
				date={event.getStartTime()}
				minimal
			/>
		</CompleteStatus>
	);
}

function StatusLine({ item, onRequirementChange }) {
	const { CalendarEvent: event } = item;

	const today = isToday(event.getStartTime(), event.getEndTime());
	// default case, render 'Starts [day] from [startTime] - [endTime]'
	const startFormat = today ? startsFrom : startsAt;
	const endFormat = today ? DateTime.TIME_PADDED_WITH_ZONE : endsAt;

	return (
		<div className="event-status-info">
			<RequiredControl
				onRequirementChange={onRequirementChange}
				item={item}
			/>
			<div className="time-display">
				<DateTime date={event.getStartTime()} format={startFormat} />
				<DateTime date={event.getEndTime()} format={endFormat} />
			</div>
		</div>
	);
}

function Contents({
	item,
	item: { CalendarEvent: event },
	isMinimal,
	hideControls,
	editMode,
	...props
}) {
	return (
		<div className="contents">
			<div className="header">
				<div className="title">{event.title}</div>
				<StatusLine item={item} {...props} />
			</div>
			{!hideControls && !editMode && <Button />}
			{event && !isMinimal && <ImageAndDescription item={item} />}
		</div>
	);
}

function Button() {
	return null;
}

function ImageAndDescription({ item }) {
	const { CalendarEvent: event } = item;

	const hasIcon = event.icon && event.icon !== 'null';

	return (
		<div className={cx('image-and-description', { iconless: !hasIcon })}>
			{hasIcon && (
				<div className="image">
					<img src={event.icon} />
				</div>
			)}
			<div className="event-info">
				{event.location && (
					<div className="location">{event.location}</div>
				)}
				<pre className="description">{event.description}</pre>
			</div>
		</div>
	);
}
