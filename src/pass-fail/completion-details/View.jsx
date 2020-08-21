import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, Iframe, Panels } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.pass-fail.requirement-details', {
	title: 'Course Requirements',
	done: 'Done',
	cancel: 'Cancel',
	assignmentReq: 'ASSIGNMENT NAME',
	viewCertificate: 'View Certificate',
	congratulations: 'Congratulations!',
	messageCompleted: 'You successfully completed the course.',
	messageTranscript: 'You will find course credit reflected on your transcript.',
	dismiss: 'Dismiss'
});

export default class CompletionDetails extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = {}

	onBeforeDismiss = () => {
		const { onBeforeDismiss } = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}
	}

	componentDidMount () {
		const {course} = this.props;

		try {
			const {PreferredAccess} = course;
			const certLink = PreferredAccess.getLink('Certificate');

			this.setState({certLink});
		}
		catch (e) {
			// no cert?
		}
	}

	renderIcon () {
		const {certLink} = this.state;

		return (
			<div className="completion-image">
				<div className="icon"/>
				{certLink && <a href={certLink} rel="noopener noreferrer" target="_blank" className="certificate-link">{t('viewCertificate')}</a>}
			</div>
		);
	}

	showCertificate = () => {
		this.setState({showCertificate: true});
	}

	renderCertificateLink () {
		const {course} = this.props;
		const {showCertificate, certLink} = this.state;

		return (
			<div className="sub-label cert-link">
				<a onClick={this.showCertificate}>{t('viewCertificate')}</a>
				{showCertificate && (
					<Prompt.Dialog onBeforeDismiss={() => this.setState({showCertificate: false})}>
						<Iframe downloadable src={certLink} title={t('certificateTitle', {title: course.PreferredAccess.CatalogEntry.title})} />
					</Prompt.Dialog>
				)}
			</div>
		);
	}

	render () {
		return (
			<Prompt.Dialog
				closeOnMaskClick
			>
				<div className="completion-details-prompt">
					<Panels.TitleBar iconAction={this.onBeforeDismiss} />
					<div className="contents-container">
						<div className="icon">
							{this.renderIcon()}
						</div>
						<div className="congratulations">{t('congratulations')}</div>
						<div className="message completed">{t('messageCompleted')}</div>
						<div className="message transcript">{t('messageTranscript')}</div>
						<div className="dismiss" onClick={this.onBeforeDismiss}>{t('dismiss')}</div>
					</div>
				</div>
			</Prompt.Dialog>
		);
	}
}
