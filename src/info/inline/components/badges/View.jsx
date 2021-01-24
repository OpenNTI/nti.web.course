import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Text} from '@nti/web-commons';
import {Credly} from '@nti/web-integrations';

const t = scoped('course.info.inline.components.badges.View', {
	label: 'Badges',
});

CourseBadges.hasData = (catalogEntry) => catalogEntry.hasLink('badges');
CourseBadges.propTypes = {
	catalogEntry: PropTypes.object
};
export default function CourseBadges ({catalogEntry}) {
	return (
		<>
			<div className="columned badges">
				<div className="field-info">
					<Text.Base className="date-label">{t('label')}</Text.Base>
				</div>
			</div>
			<Credly.Badges.AwardsBadges context={catalogEntry} readOnly />
		</>
	);
}
