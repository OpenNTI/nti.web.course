import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import Logger from '@nti/util-logger';
import classnames from 'classnames/bind';

import Sortable from './SortableHeader';
import styles from './Enrollment.css';


const cx = classnames.bind(styles);
const logger = Logger.get('roster.columns.enrollment');

const localeScope = 'roster.columns.enrollment';

const t = scoped(localeScope, {
	header: 'Enrollment',
	status: {
		'Public': 'Open',
		'Purchased': 'Open',
		'ForCredit': 'For Credit',
		'ForCreditDegree': 'For Credit',
		'ForCreditNonDegree': 'For Credit',
	}
});

const missingLocaleString = (fallback) => (key) => {
	logger.warn(`Missing locale string for ${localeScope}${key}. Rendering '${fallback}'`);
	return fallback;
};

export default class Progress extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	static HeaderComponent = props => <Sortable>Enrollment</Sortable>
	static cssClassName = cx('enrollment-cell');

	render () {
		const {item: {status} = {}} = this.props;
		return (
			<div>{t(`status.${status}`, {fallback: missingLocaleString('')})}</div>
		);
	}
}
