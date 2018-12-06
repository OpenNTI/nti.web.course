import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState} from '@nti/web-commons';

import Store from './Store';
import Enrolled from './Enrolled';
import NotEnrolled from './NotEnrolled';

const t = scoped('course.enrollment.admin.manage-enrollment', {
	notAuthorized: 'You do not have permission to edit this users enrollment.'
});

export default
@Store.connect(['loading', 'record', 'notAuthorized'])
class CourseEnrollmentAdminManageEnrollment extends React.Component {
	static deriveBindingFromProps (props) {
		return {course: props.course, user: props.user};
	}

	static propTypes = {
		user: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		enrollment: PropTypes.object,

		loading: PropTypes.bool,
		record: PropTypes.object,
		notAuthorized: PropTypes.bool
	}


	render () {
		const {loading, notAuthorized, record} = this.props;

		return (
			<div className="course-enrollment-admin-manage-enrollment">
				{loading && (<Loading.Mask />)}
				{!loading && notAuthorized && this.renderNotAuthorized()}
				{!loading && !notAuthorized && this.renderRecord(record)}
			</div>
		);
	}


	renderNotAuthorized () {
		return (
			<EmptyState header={t('notAuthorized')} />
		);
	}


	renderRecord (record) {
		const {course, user} = this.props;

		return record ?
			(<Enrolled enrollment={record} course={course} user={user} />) :
			(<NotEnrolled course={course} user={user}/>);
	}
}
