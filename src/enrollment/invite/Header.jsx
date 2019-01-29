import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import { rawContent } from '@nti/lib-commons';

const t = scoped('course.enrollment.invite.header', {
	content: 'Invite others to take <span class="course-title">%(courseTitle)s</span>. Add a message below and we’ll send your message along with a course link to the emails provided. Each email will receive a personalized invitation code. <a href="https://help.nextthought.com/guide/part3.html#course-roster" target="_blank">More Information</a>'
});

export default function Header ({course: {title: courseTitle = 'this course'} = {}}) {
	return (
		<header>
			<div {...rawContent(t('content', {courseTitle}))} />
		</header>
	);
}

Header.propTypes = {
	course: PropTypes.shape({
		title: PropTypes.string
	})
};

