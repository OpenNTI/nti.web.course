import React from 'react';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';// eslint-disable-line
import PropTypes from 'prop-types';

const DEFAULT_TEXT = {
	completion: 'Completion',
	lti: 'LTI Tools',
};

const t = scoped('web-course.admin-tools.advanced.nav-bar.Tabs', DEFAULT_TEXT);

export default function CourseAdminAdvancedTabs ({ course }) {
	const hasLTI = course.hasLink('lti-configured-tools');
	return (
		<ul className="course-admin-advanced-tabs">
			<li>
				<LinkTo.Path to="./" exact activeClassName="active">{t('completion')}</LinkTo.Path>
			</li>
			{hasLTI && (
				<li>
					<LinkTo.Path to="./lti" activeClassName="active">{t('lti')}</LinkTo.Path>
				</li>
			)}
		</ul>
	);
}

CourseAdminAdvancedTabs.propTypes = {
	course: PropTypes.shape({
		hasLink: PropTypes.func.isRequired
	}).isRequired
};
