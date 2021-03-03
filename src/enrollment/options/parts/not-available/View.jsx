import React from 'react';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

import Title from '../../common/Title';
import Description from '../../common/Description';
import Button from '../../common/Button';

const t = scoped('course.enrollment.options.NotAvailable', {
	title: 'Invitation only',
	description: 'This course is available via invitation only.',
	redeem: 'Redeem Invitation Code'
});


export default function CourseEnrollmentOptionsNotAvailable() {
	return (
		<div>
			<Title>{t('title')}</Title>
			<Description>{t('description')}</Description>
			<LinkTo.Object object={{type: 'redeem-course-code'}}>
				<Button>
					{t('redeem')}
				</Button>
			</LinkTo.Object>
		</div>
	);
}
