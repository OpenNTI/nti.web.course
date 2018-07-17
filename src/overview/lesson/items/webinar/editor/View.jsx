import React from 'react';
import PropTypes from 'prop-types';

import Registration from './panels/Registration';
import Overview from './panels/Overview';
import BrowseWebinars from './panels/BrowseWebinars';

const REGISTRATION = 'registration';
const BROWSE_LIST = 'browse-list';
const OVERVIEW = 'overview';


export default class WebinarEditor extends React.Component {
	static propTypes = {
		activePanel: PropTypes.string,
		course: PropTypes.object.isRequired,
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		webinar: PropTypes.object,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func,
		onAddAsExternalLink: PropTypes.func,
		onDelete: PropTypes.func
	}

	state = {
		activePanel: BROWSE_LIST
	}

	componentDidMount () {
		const {webinar: webinarAsset, activePanel} = this.props;

		if(webinarAsset) {
			this.setState({activePanel: OVERVIEW, webinar: webinarAsset.webinar});
		}
		else if(activePanel) {
			this.setState({activePanel: activePanel});
		}
	}

	togglePanel = () => {
		if(this.state.activePanel === REGISTRATION) {
			this.setState({activePanel: OVERVIEW});
		}
		else if(this.state.activePanel === BROWSE_LIST) {
			this.setState({activePanel: REGISTRATION});
		}
		else {
			this.setState({activePanel: BROWSE_LIST});
		}
	}

	render () {
		const {onCancel, onAddToLesson, onDelete, lessonOverview, overviewGroup, webinar: webinarAsset, course} = this.props;
		const {webinar} = this.state;

		return (
			<div className="webinar-editor">
				{/* {!this.props.activePanel && <div onClick={this.togglePanel}>Toggle</div>} */}
				{this.state.activePanel === REGISTRATION && (
					<Registration
						onWebinarSelected={(selectedWebinar) => {
							this.setState({activePanel: OVERVIEW, webinar: selectedWebinar});
						}}
						onAddAsExternalLink={(url) => {
							const {onAddAsExternalLink} = this.props;

							onAddAsExternalLink(url);
						}}
						context={course}
						onLinkClick={() => {
							this.setState({activePanel: BROWSE_LIST});
						}}
					/>
				)}
				{this.state.activePanel === BROWSE_LIST && (
					<BrowseWebinars
						course={course}
						onLinkClick={() => {
							this.setState({activePanel: REGISTRATION});
						}}
						onWebinarClick={(selectedWebinar) => {
							this.setState({activePanel: OVERVIEW, webinar: selectedWebinar});
						}}
					/>
				)}
				{this.state.activePanel === OVERVIEW && webinar && (
					<Overview
						lessonOverview={lessonOverview}
						overviewGroup={overviewGroup}
						webinar={webinar}
						item={webinarAsset}
						onCancel={onCancel}
						onAddToLesson={onAddToLesson}
						onDelete={onDelete}
					/>
				)}
			</div>
		);
	}
}
