import React from 'react';
import PropTypes from 'prop-types';
import {Loading, DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {Connectors} from '@nti/lib-store';

const t = scoped('course.overview.lesson.items.event.common.Browse', {
	noEvents: 'There are no existing events.',
	addNew: 'Create an Event'
});

export default
@Connectors.Any.connect(['loading', 'events'])
class BrowseEvents extends React.Component {
	static propTypes = {
		onSelect: PropTypes.func,
		loading: PropTypes.bool,
		events: PropTypes.arrayOf(PropTypes.object)
	}

	state = {}

	renderEvent = (event) => {
		return (
			<div key={event.getID()} className="event" onClick={() => this.props.onSelect(event)}>
				<div className="icon">
					{event.icon ? <img src={event.icon}/> : <div className="no-icon"/>}
				</div>
				<div className="info">
					<div className="title">{event.title}</div>
					<div className="date">{DateTime.format(event.getStartTime(), 'LL [at] h:mm a')}</div>
				</div>
			</div>
		);
	}

	renderEventList () {
		const {events} = this.props;

		if(!events || events.length === 0) {
			return (
				<div className="empty-state">
					<div className="no-events">{t('noEvents')}</div>
					<div className="add-new" onClick={() => this.props.onSelect()}>{t('addNew')}</div>
				</div>
			);
		}

		return <div className="event-list">{events.map(this.renderEvent)}</div>;
	}

	render () {
		const {loading} = this.props;

		return (
			<div className="event-browser">
				<div className="toolbar">
					<div className="create-new" onClick={() => this.props.onSelect()}><i className="icon-add"/></div>
				</div>
				{loading && <Loading.Ellipsis/>}
				{!loading && this.renderEventList()}
			</div>
		);
	}
}
