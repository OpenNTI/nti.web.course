import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {PieChart} from '@nti/web-charts';

import {default as Store, KEYS} from './Store';
import styles from './EnrollmentBreakdown.css';

const cx = classnames.bind(styles);

export default
@Store.monitor({
	[KEYS.ROSTER_SUMMARY]: 'summary'
})
class EnrollmentBreakdown extends React.Component {

	static propTypes = {
		summary: PropTypes.shape({
			TotalEnrollmentsByScope: PropTypes.object
		})
	}

	render () {
		const {
			summary: {
				TotalEnrollmentsByScope: scopes = {}
			} = {}
		} = this.props;

		const series = Object.entries(scopes)
			.map(([label, value]) => ({label, value}))
			.sort(({value: a = 0}, {value: b = 0}) => b - a);

		return (
			<PieChart series={series} className={cx('enrollment-breakdown')} />
		);
	}
}
