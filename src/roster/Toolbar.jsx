import React from 'react';
import classnames from 'classnames/bind';

import ManageEnrollment from '../enrollment/admin/Prompt';

import Invite from './Invite';
import FilterMenu from './FilterMenu';
import styles from './Toolbar.css';


const cx = classnames.bind(styles);

export default class Toolbar extends React.Component {
	render () {
		return (
			<div className={cx('toolbar')}>
				<FilterMenu />
				<ManageEnrollment.Trigger>Manage Enrollments</ManageEnrollment.Trigger>
				<Invite />
			</div>
		);
	}
}

