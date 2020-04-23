import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Description from '../../../widgets/Description';

const t = scoped('course.info.inline.components.access.components.OverviewContainer', {
	label: 'Access',
	description: 'Choose how learners will access your course.'
});

CourseAccessOverviewContainer.propTypes = {
	children: PropTypes.any,
	extra: PropTypes.any
};
export default function CourseAccessOverviewContainer ({children, extra}) {
	return (
		<div className="columned access">
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
				<Description>{t('description')}</Description>
				{extra}
			</div>
			<div className="content-column">
				{children}
			</div>
		</div>
	);
}