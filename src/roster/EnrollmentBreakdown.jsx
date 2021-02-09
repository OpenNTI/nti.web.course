import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {decorate} from '@nti/lib-commons';
import {PieChart} from '@nti/web-charts';
import {scoped} from '@nti/lib-locale';

import {DEFAULT_ENROLLMENT_SCOPE_NAMES} from '../enrollment/Constants';

import {default as Store, KEYS} from './Store';
import styles from './EnrollmentBreakdown.css';

const cx = classnames.bind(styles);
const classes = {
	container: cx('chart-container'),
	chart: cx('chart-chart'),
	legend: cx('chart-legend'),
};

const t = scoped('course.roster.enrollment-breakdown', {
	title: 'Enrollment Breakdown',
	scopes: DEFAULT_ENROLLMENT_SCOPE_NAMES
});

class EnrollmentBreakdown extends React.Component {

	static propTypes = {
		scopes: PropTypes.shape({
			TotalEnrollmentsByScope: PropTypes.object
		})
	}

	render () {
		const {scopes} = this.props;

		const series = Object.entries(scopes)
			.map(([label, value]) => (
				{
					label: t(['scopes', label], {fallback: label}),
					value
				})
			)
			.sort(({value: a = 0}, {value: b = 0}) => b - a);

		return (
			<div className={cx('enrollment-breakdown-wrapper')}>
				<div className={cx('enrollment-breakdown')}>
					<PieChart title={t('title')} classes={classes} series={series} />
				</div>
			</div>
		);
	}
}

export default decorate(EnrollmentBreakdown, [
	Store.monitor({
		[KEYS.ENROLLMENT_SCOPES]: 'scopes'
	})
]);
