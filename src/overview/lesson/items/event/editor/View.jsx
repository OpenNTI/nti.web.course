import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';

import Overview from '../common/EventOverview';
import Browse from '../common/Browse';

import Store from './Store';

const BROWSE_LIST = 'browse-list';
const OVERVIEW = 'overview';

class EventEditor extends React.Component {
	static propTypes = {
		activePanel: PropTypes.string,
		course: PropTypes.object.isRequired,
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		event: PropTypes.object,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func,
		onAddAsExternalLink: PropTypes.func,
		onDelete: PropTypes.func,
		saveDisabled: PropTypes.bool,
	};

	static deriveBindingFromProps({ course }) {
		return {
			course,
		};
	}

	state = {
		activePanel: BROWSE_LIST,
	};

	componentDidMount() {
		const { event, activePanel } = this.props;

		if (event) {
			this.setState({
				activePanel: OVERVIEW,
				event: event.CalendarEvent,
			});
		} else if (activePanel) {
			this.setState({ activePanel: activePanel });
		}
	}

	togglePanel = () => {
		if (this.state.activePanel === BROWSE_LIST) {
			this.setState({ activePanel: OVERVIEW });
		} else {
			this.setState({ activePanel: BROWSE_LIST });
		}
	};

	render() {
		const {
			course,
			onCancel,
			onAddToLesson,
			onDelete,
			lessonOverview,
			overviewGroup,
			saveDisabled,
			event: eventRef,
		} = this.props;
		const { event } = this.state;

		return (
			<div className="event-editor">
				{this.state.activePanel === BROWSE_LIST && (
					<Browse
						course={course}
						onSelect={selectedEvent => {
							this.setState({
								event: selectedEvent,
								activePanel: OVERVIEW,
							});
						}}
					/>
				)}
				{this.state.activePanel === OVERVIEW && (
					<Overview
						lessonOverview={lessonOverview}
						overviewGroup={overviewGroup}
						event={event}
						item={eventRef}
						course={course}
						onCancel={onCancel}
						onAddToLesson={onAddToLesson}
						onDelete={onDelete}
						saveDisabled={saveDisabled}
					/>
				)}
			</div>
		);
	}
}

export default decorate(EventEditor, [Store.connect(['loading', 'events'])]);
