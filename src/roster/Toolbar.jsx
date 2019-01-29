import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import ManageEnrollment from '../enrollment/admin/Prompt';

import Invite from './Invite';
import FilterMenu from './FilterMenu';
import styles from './Toolbar.css';

const cx = classnames.bind(styles);
const t = scoped('course.roster.toolbar', {
	manageEnrollments: 'Manage Enrollment'
});

export default class Toolbar extends React.Component {
	
	render () {
		const {course} = this.props;

		return (
			<div className={cx('toolbar')}>
				<FilterMenu />
				<div className={cx('enrollment-controls')}>
					<ManageEnrollment.Trigger course={course} className={cx('manage-enrollment-button')}>{t('manageEnrollments')}</ManageEnrollment.Trigger>
					<Invite />
				</div>
			</div>
		);
	}
}

Toolbar.propTypes = {
	course: PropTypes.object
};
