import React from 'react';
import { scoped } from '@nti/lib-locale';


import ExternalEnrollment from './ExternalEnrollment';

const t = scoped('course.info.inline.enrollment.options.CustomExternalEnrollment', {
	title: 'Custom External',
	description: 'Enroll using a custom URL'
});

export default function CustomExternalEnrollment (props) {
	return (
		<ExternalEnrollment
			customTitle={t('title')}
			customDescription={t('description')}
			className="custom"
			{...props}
		/>
	);
}
