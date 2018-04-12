import React from 'react';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';// eslint-disable-line

const DEFAULT_TEXT = {
	completion: 'Completion',
	lti: 'LTI Tools',
};

const t = scoped('web-course.admin-tools.advanced.nav-bar.Tabs', DEFAULT_TEXT);

export default function CourseAdminAdvancedTabs () {
	return (
		<ul className="course-admin-advanced-tabs">
			<li>
				<LinkTo.Path to="/" exact activeClassName="active">{t('completion')}</LinkTo.Path>
			</li>
			<li>
				<LinkTo.Path to="/lti" activeClassName="active">{t('lti')}</LinkTo.Path>
			</li>
		</ul>
	);
}
