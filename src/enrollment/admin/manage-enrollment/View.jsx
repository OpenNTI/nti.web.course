import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState} from '@nti/web-commons';

import Store from './Store';
import Option from './Option';
import Advanced from './Advanced';

const t = scoped('course.enrollment.admin.manage-enrollment', {
	notAuthorized: 'You do not have permission to edit this user\'s enrollment.',
	enrolled: 'Enrolled',
	notEnrolled: 'Not Enrolled'
});

export default
@Store.connect(['loading', 'error', 'record', 'notAuthorized', 'options', 'enrollInOption', 'dropCourse', 'enrollInScope'])
class CourseEnrollmentAdminManageEnrollment extends React.Component {
	static deriveBindingFromProps (props) {
		return {course: props.course, user: props.user, enrollment: props.enrollment, onChange: props.onChange};
	}

	static propTypes = {
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
		course: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
		enrollment: PropTypes.object,
		onChange: PropTypes.func,

		loading: PropTypes.bool,
		record: PropTypes.object,
		error: PropTypes.object,
		options: PropTypes.array,
		notAuthorized: PropTypes.bool,
		enrollInScope: PropTypes.func,
		enrollInOption: PropTypes.func,
		dropCourse: PropTypes.func
	}


	render () {
		const {loading, notAuthorized, record, error} = this.props;

		return (
			<div className="course-enrollment-admin-manage-enrollment">
				{loading && (<Loading.Mask />)}
				{!loading && error && this.renderError(error)}
				{!loading && notAuthorized && this.renderNotAuthorized()}
				{!loading && !notAuthorized && this.renderRecord(record)}
			</div>
		);
	}


	renderError (error) {
		return (
			<span className="error">
				{(error && (error.message || error.Message)) || t('notAuthorized')}
			</span>
		);
	}


	renderNotAuthorized () {
		return (
			<EmptyState header={t('notAuthorized')} />
		);
	}

	renderRecord (record) {
		const {options, enrollInOption, dropCourse, enrollInScope} = this.props;
		const listOptions = record ? options.filter(o => o.isEnrolled()) : options;

		return (
			<div>
				<div className={cx('enrolled-header', {enrolled: !!record})}>
					{record && (<i className="icon-check" />)}
					{!record && (<i className="icon-bold-x" />)}
					<span className="label">{record ? t('enrolled') : t('notEnrolled')}</span>
				</div>
				<ul className="enrollment-options">
					{listOptions.map((option, index) => {
						return (
							<li key={index}>
								<Option option={option} enrollInOption={enrollInOption} dropCourse={dropCourse}/>
							</li>
						);
					})}
				</ul>
				<Advanced enrollInScope={enrollInScope} />
			</div>
		);
	}
}
