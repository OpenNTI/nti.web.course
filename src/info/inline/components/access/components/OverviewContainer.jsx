import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';

import Description from '../../../widgets/Description';

import Styles from './OverviewContainer.css';

const cx = classnames.bind(Styles);
const t = scoped(
	'course.info.inline.components.access.components.OverviewContainer',
	{
		label: 'Access',
		description: 'Choose how learners will access your course.',
	}
);

CourseAccessOverviewContainer.propTypes = {
	children: PropTypes.any,
	extra: PropTypes.any,
};
export default function CourseAccessOverviewContainer({ children, extra }) {
	return (
		<div className={cx('columned', 'access', 'course-access-container')}>
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
				<Description>{t('description')}</Description>
				{extra}
			</div>
			<div className="content-column">{children}</div>
		</div>
	);
}
