import React from 'react';
import PropTypes from 'prop-types';
import {TokenEditor} from '@nti/web-commons';
import classnames from 'classnames/bind';

import styles from './EmailsInput.css';

const cx = classnames.bind(styles);

export default class EmailsInput extends React.Component {
	static propTypes = {
		value: PropTypes.array,
		onChange: PropTypes.func,
		placeholder: PropTypes.string
	}

	render () {
		const {value, placeholder, onChange} = this.props;

		return (
			<TokenEditor className={cx('invite-emails-input')} value={value} onChange={onChange} placeholder={placeholder} />
		);
	}
}