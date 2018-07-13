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
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func
	}

	state = {
		activePanel: BROWSE_LIST
	}

	componentDidMount () {
		if(this.props.activePanel) {
			this.setState({activePanel: this.props.activePanel});
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
		const {onCancel, onAddToLesson, lessonOverview, overviewGroup, course} = this.props;
		const {webinar} = this.state;

		return (
			<div className="webinar-editor">
				{/* {!this.props.activePanel && <div onClick={this.togglePanel}>Toggle</div>} */}
				{this.state.activePanel === REGISTRATION && (
					<Registration
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
						onCancel={onCancel}
						onAddToLesson={onAddToLesson}
					/>
				)}
			</div>
		);
	}
}
