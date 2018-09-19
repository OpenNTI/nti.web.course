import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.navigation.tabs.editor.Tab', {
	descriptions: {
		'activity': 'A summary of the activity and content available in the course.',
		'lessons': 'The contents of the course',
		'scorm': 'The contents of the course',
		'assignments': 'All the assignments in the course',
		'discussions': 'The discussions in the course',
		'info': 'The information about the course'
	}
});

export default class CourseNavigationTabsEditorTab extends React.Component {
	static propTypes = {
		tab: PropTypes.shape({
			id: PropTypes.string,
			label: PropTypes.string,
			default: PropTypes.string
		}).isRequired,
		onTabChange: PropTypes.func
	}


	onLabelChange = (label) => {
		const {tab, onTabChange} = this.props;

		if (onTabChange) {
			onTabChange(tab.id, label);
		}
	}


	render () {
		const {tab} = this.props;

		return (
			<div className="nti-course-navigation-tabs-editor-tab">
				<div className="input-container">
					<Input.Text value={tab.label} placeholder={tab.default} onChange={this.onLabelChange}/>
				</div>
				<div className="description">
					{t(`descriptions.${tab.id}`)}
				</div>
			</div>
		);
	}
}
