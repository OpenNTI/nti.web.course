import React from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './ParticipationReport.css';

const cx = classnames.bind(styles);


export default class ParticipationReport extends React.Component {
	
	static cssClassName = cx('participation-report-cell')

	render () {
		return (
			<div className={cx('participation-report')}><i className={cx('icon-report')} /></div>
		);
	}
}
