import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

import ManageEnrollment from '../enrollment/admin/Prompt';

import Store from './Store';
import Invite from './Invite';
import Mail from './Mail';
import FilterMenu from './FilterMenu';
import styles from './Toolbar.css';

const cx = classnames.bind(styles);
const t = scoped('course.roster.toolbar', {
	manageEnrollments: 'Manage Enrollment',
});

class Toolbar extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		reload: PropTypes.func,
	};

	render() {
		const { course, reload } = this.props;
		const { canManageEnrollment } = course || {};

		return (
			<div className={cx('toolbar')}>
				<FilterMenu />
				<div className={cx('enrollment-controls')}>
					{canManageEnrollment && (
						<ManageEnrollment.Trigger
							course={course}
							className={cx('manage-enrollment-button')}
							onChange={reload}
						>
							{t('manageEnrollments')}
						</ManageEnrollment.Trigger>
					)}
					<Invite />
					<Mail />
				</div>
			</div>
		);
	}
}

export default decorate(Toolbar, [Store.monitor(['reload'])]);
