import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';

import Styles from './Header.css';

const cx = classnames.bind(Styles);
const t = scoped('course.enrollment.invite.header', {
	title: 'Course Invitation',
	content:
		'Invite learners to join <span class="course-title">%(courseTitle)s</span>. Invitations provide direct access—bypassing any purchase options.',
});

export default function Header({
	course: { title: courseTitle = 'this course' } = {},
}) {
	return (
		<header className={cx('header')}>
			<Text.Base className={cx('title')} localized>
				{t('title')}
			</Text.Base>
			<Text.Base className={cx('description')} localized>
				{t('content', { courseTitle })}
			</Text.Base>
		</header>
	);
}

Header.propTypes = {
	course: PropTypes.shape({
		title: PropTypes.string,
	}),
};
