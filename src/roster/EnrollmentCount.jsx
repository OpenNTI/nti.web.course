import React from 'react';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';

import Styles from './EnrollmentCount.css';
import Store from './Store';

const cx = classnames.bind(Styles);
const t = scoped('course.roster.EnrollmentCount', {
	label: {
		one: 'Learner',
		other: 'Learners',
	},
});

export default function EnrollmentCount() {
	const { summary } = Store.useMonitor({
		[Store.Keys.ROSTER_SUMMARY]: 'summary',
	});

	if (!summary) {
		return null;
	}

	const count = summary.TotalEnrollments;

	return (
		<div className={cx('enrollment-count')}>
			<Text.Base className={cx('count')}>{count}</Text.Base>
			<Text.Base className={cx('label')}>
				{t('label', { count })}
			</Text.Base>
		</div>
	);
}
