import React from 'react';
import PropTypes from 'prop-types';
import { Input, TokenEditor } from '@nti/web-commons';
import classnames from 'classnames/bind';
import { validate as isEmail } from 'email-validator';

import styles from './EmailsInput.css';

const cx = classnames.bind(styles);

export default class EmailsInput extends React.Component {
	static propTypes = {
		value: PropTypes.array,
		onChange: PropTypes.func,
		onFileChange: PropTypes.func,
		placeholder: PropTypes.string,
		uploadButtonLabel: PropTypes.string,
	};

	validator = value => {
		let errors = [];

		if (!value || !isEmail(value)) {
			errors.push('Invalid email address');
		}

		return errors;
	};

	render() {
		const {
			value,
			placeholder,
			onChange,
			onFileChange,
			uploadButtonLabel,
		} = this.props;
		const isEmpty = (value || []).length === 0;

		return (
			<div className={cx('emails-input-container')}>
				<TokenEditor
					className={cx('email-tokens-input')}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					validator={this.validator}
				/>
				{isEmpty && (
					<Input.File
						className={cx('file-input')}
						accept="text/csv"
						onFileChange={onFileChange}
						onError={this.onFileError}
						label={uploadButtonLabel}
					/>
				)}
			</div>
		);
	}
}
