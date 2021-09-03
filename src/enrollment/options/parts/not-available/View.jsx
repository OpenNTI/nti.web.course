import React from 'react';

import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { useService } from '@nti/web-core';

import Title from '../../common/Title';
import Description from '../../common/Description';
import Button from '../../common/Button';

const t = scoped('course.enrollment.options.NotAvailable', {
	title: 'Invitation only',
	description: 'This course is available via invitation only.',
	redeem: {
		authenticated: 'Redeem Invitation Code',
		unauthenticated: 'Sign In To Get Started',
	},
});

export default function CourseEnrollmentOptionsNotAvailable() {
	const { isAnonymous } = useService();
	const scope = isAnonymous ? 'unauthenticated' : 'authenticated';

	return (
		<div>
			<Title>{t('title')}</Title>
			<Description>{t('description')}</Description>
			<LinkTo.Object object={{ type: 'redeem-course-code' }}>
				<Button>{t(['redeem', scope])}</Button>
			</LinkTo.Object>
		</div>
	);
}
