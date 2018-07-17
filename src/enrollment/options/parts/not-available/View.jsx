import React from 'react';
import {scoped} from '@nti/lib-locale';

import Title from '../../common/Title';
import Description from '../../common/Description';

const t = scoped('course.enrollment.options.NotAvailable', {
	title: 'Not Available',
	description: 'This course is not available at this time. For further assistance please contact the <a class=\'link\' href=\'mailto:support@nextthought.com\'>help desk.</a>'
});

export default function CourseEnrollmentOptionsNotAvailable () {
	return (
		<div>
			<Title>
				{t('title')}
			</Title>
			<Description>
				{t('description')}
			</Description>
		</div>
	);
}
