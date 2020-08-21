import './Tab.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Input} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {getTabError} from './utils';

const t = scoped('course.navigation.tabs.editor.Tab', {
	descriptions: {
		'activity': 'This tab displays a summary of social activity and content arranged on a convenient week-by-week timeline.',
		'lessons': 'This tab opens by default and contains all activities and content including readings, files, videos, assessments, discussions, and more, organized into units, lessons, and sections.',
		'scorm': 'The tab opens by default and contains the SCORM content.',
		'assignments': 'This tab contains all assignments. Learners can take assignments, view progress, and see scores. Facilitators can view learner progress, see reports, and add feedback and scores.',
		'community': 'This tab offers forums to promote engagement and discussion. Both learners and facilitators can create a new discussion. Facilitators can also post announcements.',
		'info': 'This tab includes information such as the title, description, credit awarded, start date, facilitators, and contact info. Facilitators can access reports, rosters, and other tools here.'
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
		const error = getTabError(tab);

		return (
			<div className="nti-course-navigation-tabs-editor-tab">
				<div className="input-container">
					<Input.Text className={cx({error})} value={tab.label} placeholder={tab.default} onChange={this.onLabelChange} />
					<div className="error-container">{error || ''}</div>
				</div>
				<div className="description">
					{t(`descriptions.${tab.id}`)}
				</div>
			</div>
		);
	}
}
