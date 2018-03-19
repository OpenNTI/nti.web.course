import React from 'react';
import {scoped} from 'nti-lib-locale';
import {LinkTo} from 'nti-web-routing';// eslint-disable-line

const DEFAULT_TEXT = {
	completion: 'Completion'
};

const t = scoped('nti-web-course.admin-tools.advanced.nav-bar.Tabs', DEFAULT_TEXT);

export default function CourseAdminAdvancedTabs () {
	return (
		<ul className="course-admin-advanced-tabs">
			<li>
				<LinkTo.Path to="./" activeClassName="active">{t('completion')}</LinkTo.Path>
			</li>
		</ul>
	);
}
