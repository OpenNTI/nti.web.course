import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import Logger from '@nti/util-logger';

import { DEFAULT_ENROLLMENT_SCOPE_NAMES } from '../../enrollment/Constants';

import styles from './Enrollment.css';

const cx = classnames.bind(styles);
const logger = Logger.get('roster.columns.enrollment');

const localeScope = 'roster.columns.enrollment';

const t = scoped(localeScope, {
	header: 'Enrollment',
	status: DEFAULT_ENROLLMENT_SCOPE_NAMES,
});

const missingLocaleString = fallback => key => {
	logger.warn(
		`Missing locale string for ${localeScope}${key}. Rendering '${fallback}'`
	);
	return fallback;
};

export default class Progress extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	static Name = t('header');
	static cssClassName = cx('enrollment-cell');

	render() {
		const { item: { status } = {} } = this.props;
		return (
			<div>
				{t(`status.${status}`, { fallback: missingLocaleString('') })}
			</div>
		);
	}
}
