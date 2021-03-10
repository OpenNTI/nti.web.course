import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { DialogButtons, Loading, Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Header from './Header';
import EmailsInput from './EmailsInput';
import Error from './Error';
import InvalidEmails from './InvalidEmails';
import styles from './View.css';

const BASE_LOCALE_SCOPE = 'course.enrollment.invite';

const cx = classnames.bind(styles);
const t = scoped(BASE_LOCALE_SCOPE, {
	placeholders: {
		emails: 'Add an email address',
		message: '(Optional) Type a message…',
	},
	uploadButtonLabel: 'Bulk',
});

export default class View extends React.Component {
	static propTypes = {
		onSuccess: PropTypes.func,
		onCancel: PropTypes.func,
		course: PropTypes.object.isRequired,
	};

	state = {};

	onEmailsChange = emails => {
		this.setState({ emails });
	};

	onFileChange = async file => {
		if (!file) {
			return;
		}

		const { course } = this.props;
		let { emails } = this.state;
		let error, invalid;

		this.setState({
			error,
			invalid,
			busy: true,
		});

		try {
			const {
				Items: items,
				InvalidEmails: invalidEmails,
			} = await course.preflightInvitationsCsv(file);
			invalid = (invalidEmails || {}).Items;
			emails = items.map(({ email }) => email);
		} catch (e) {
			error = e;
		}

		this.setState({
			emails,
			error,
			invalid,
			busy: false,
		});
	};

	onMessageChange = message => {
		this.setState({ message });
	};

	onSend = async () => {
		const {
			props: { course, onSuccess },
			state: { emails, message },
		} = this;
		let error;
		this.setState({
			error,
			busy: true,
		});

		try {
			const result = await course.sendInvitations(emails, message);
			return onSuccess(result);
		} catch (e) {
			error = e;
		}

		this.setState({
			error,
			busy: false,
		});
	};

	render() {
		const {
			props: { course, onCancel },
			state: { emails = [], invalid, message = '', error, busy },
		} = this;

		const canSend = !!emails.length && (course || {}).canInvite;

		const buttons = [
			{
				label: 'Cancel',
				onClick: onCancel,
			},
			{
				label: 'Send',
				onClick: this.onSend,
				disabled: !canSend,
			},
		];

		return (
			<section className={cx('invitation-form')}>
				<Header course={course} />
				<EmailsInput
					value={emails}
					onChange={this.onEmailsChange}
					placeholder={t('placeholders.emails')}
					onFileChange={this.onFileChange}
					uploadButtonLabel={t('uploadButtonLabel')}
				/>
				<Error error={error} />
				<InvalidEmails invalid={invalid} />
				<div className={cx('message')}>
					<Input.TextArea
						value={message}
						placeholder={t('placeholders.message')}
						onChange={this.onMessageChange}
						autoGrow
					/>
				</div>
				<DialogButtons buttons={buttons} />
				{busy && (
					<div className={cx('loading')}>
						<Loading.Spinner />
					</div>
				)}
			</section>
		);
	}
}
