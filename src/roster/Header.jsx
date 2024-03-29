import React from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import EnrollmentBreakdown from './EnrollmentBreakdown';
import EnrollmentCount from './EnrollmentCount';
import styles from './Header.css';

const cx = classnames.bind(styles);

export default class Header extends React.Component {
	render() {
		return (
			<header className={cx('header')}>
				<EnrollmentCount />
				<EnrollmentBreakdown />
			</header>
		);
	}
}
