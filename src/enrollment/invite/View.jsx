import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Prompt, Input, DialogButtons} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {PlaintextEditor} from '@nti/web-editor';

import Header from './Header';
import EmailsInput from './EmailsInput';
import styles from './View.css';

const cx = classnames.bind(styles);
const t = scoped('course.enrollment.invite', {
	placeholders: {
		emails: 'Add an email address',
		message: '(Optional) Type a message…'
	}
});


export default class View extends React.Component {

	static propTypes = {
		onClose: PropTypes.func,
		course: PropTypes.object.isRequired
	}

	state = {}

	onEmailsChange = emails => {
		this.setState({emails});
	}

	onFileChange = async file => {
		const {course} = this.props;

		try {
			const {Items: emails, InvalidEmails: invalid} = await course.preflightInvitationsCsv(file);

			this.setState({
				emails: emails.map(({email}) => email)
			});
		}
		catch (e) {
			console.error(e);
		}

		this.setState({file});
	}
	
	onMessageChange = message => {
		this.setState({message});
	}

	onSend = () => {
		console.log('send!');
	}

	render () {
		const {
			onClose,
		} = this.props;

		const {
			emails = [],
			file,
			message = ''
		} = this.state;

		const canSend = !!emails.length;

		const buttons = [
			{
				label: 'Cancel',
				onClick: onClose
			},
			{
				label: 'Send',
				onClick: this.onSend,
				disabled: !canSend
			}
		];

		return (
			<Prompt.Dialog onBeforeDismiss={onClose}>
				<section className={cx('invite-dialog-content')}>
					<Header />
					<EmailsInput value={emails} onChange={this.onEmailsChange} placeholder={t('placeholders.emails')} />
					<Input.FileDrop allowedTypes={{'text/csv': true}} onChange={this.onFileChange} onError={this.onFileError} value={file} getString={t} />
					<PlaintextEditor text={message} placeholder={t('placeholders.message')} onChange={this.onMessageChange} />
					<DialogButtons buttons={buttons} />
				</section>
			</Prompt.Dialog>
		);
	}
}
