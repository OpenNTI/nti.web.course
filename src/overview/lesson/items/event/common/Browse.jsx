import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading, DateTime, Prompt, Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { Connectors } from '@nti/lib-store';

const t = scoped('course.overview.lesson.items.event.common.Browse', {
	noEvents: 'There are no existing events.',
	noEventsForFilter: 'There are no events that match this search term.',
	addNew: 'Create an Event',
	deleteConfirmation:
		'Removing this event will also remove it from any other lessons.',
	searchPlaceholder: 'Search events...',
	noIcon: 'No Icon',
});

class BrowseEvents extends React.Component {
	static propTypes = {
		onSelect: PropTypes.func,
		loading: PropTypes.bool,
		deleteEvent: PropTypes.func,
		doSearch: PropTypes.func,
		searchTerm: PropTypes.string,
		events: PropTypes.arrayOf(PropTypes.object),
	};

	state = {};

	renderEvent = event => {
		return (
			<div
				key={event.getID()}
				className="event"
				onClick={() => this.props.onSelect(event)}
			>
				<div className="icon">
					{event.icon && event.icon !== 'null' ? (
						<img src={event.icon} />
					) : (
						<div className="no-icon">{t('noIcon')}</div>
					)}
				</div>
				<div className="info">
					<div className="title">{event.title}</div>
					<div className="date">
						{DateTime.format(
							event.getStartTime(),
							DateTime.MONTH_NAME_DAY_YEAR_AT_TIME
						)}
					</div>
				</div>
				<div
					className="remove"
					onClick={e => {
						e.stopPropagation();
						e.preventDefault();

						Prompt.areYouSure(t('deleteConfirmation')).then(() => {
							this.props.deleteEvent(event);
						});
					}}
				>
					<i className="icon-remove" />
				</div>
			</div>
		);
	};

	renderEventList() {
		const { events, searchTerm } = this.props;

		if (!events || events.length === 0) {
			return (
				<div className="empty-state">
					<div className="no-events">
						{searchTerm ? t('noEventsForFilter') : t('noEvents')}
					</div>
					{!searchTerm && (
						<div
							className="add-new"
							onClick={() => this.props.onSelect()}
						>
							{t('addNew')}
						</div>
					)}
				</div>
			);
		}

		return <div className="event-list">{events.map(this.renderEvent)}</div>;
	}

	render() {
		const { loading, searchTerm, doSearch } = this.props;

		return (
			<div className="event-browser">
				<div className="toolbar">
					<div className="search">
						<Input.Text
							value={searchTerm}
							onChange={val => doSearch(val)}
							placeholder={t('searchPlaceholder')}
						/>
						<i className="icon-search" />
					</div>
					<div
						className="create-new"
						onClick={() => this.props.onSelect()}
					>
						<i className="icon-add" />
					</div>
				</div>
				{loading && (
					<div className="loading">
						<Loading.Ellipsis />
					</div>
				)}
				{!loading && this.renderEventList()}
			</div>
		);
	}
}

export default decorate(BrowseEvents, [
	Connectors.Any.connect([
		'loading',
		'events',
		'deleteEvent',
		'doSearch',
		'searchTerm',
	]),
]);
