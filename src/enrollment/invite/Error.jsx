import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import styles from './Error.css';

const cx = classnames.bind(styles);

const t = scoped('course.roster.invite.error', {
	InvalidCSVFileCodeError: 'Could not parse csv file.',
	unknown: 'An unknown error occurred.'
});

export default function Error ({error}) {
	if (!error) {
		return null;
	}

	const {code, message} = error;
	const m = t(code, {
		fallback: message || t('unknown')
	});

	return !error ? null : (
		<div className={cx('error')}>{m}</div>
	);
}

Error.propTypes = {
	error: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			code: PropTypes.string,
			message: PropTypes.string
		})
	])
};