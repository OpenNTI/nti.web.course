import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.invite.header', {
	content: 'Invite others to take %(courseTitle)s. Add a message below and we’ll send your message along with a course link to the emails provided. Each email will receive a personalized invitation code.'
});

export default function Header (props) {
	return (
		<header>
			<div>{t('content', {courseTitle: 'The Reactified Roster Course'})}</div>
		</header>
	);
}