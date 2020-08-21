import './Registration.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {GotoWebinar} from '@nti/web-integrations';
import cx from 'classnames';

import BaseItem from '../../BaseItem';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.Registration', {
	title: 'Paste or Enter a Registration Link',
	description: 'After you create a webinar in GoToWebinar you can add it to your course by providing a registration link.',
	learnMore: 'Learn More',
	steps: 'Steps',
	step1: 'Login to GoToWebinar and navigate to "My Webinars"',
	step2: 'Find the webinar you want to add',
	step3: 'Click "Share"',
	step4: 'Click "Copy Registration Link"',
	placeholder: 'Enter or paste a webinar key',
	webinarLinkDesc: 'Find a webinar by browsing',
	pasteLink: 'Click Here',
	addAsResourceTitle: 'Add as web resource instead?',
	addAsResourceDesc: 'Reporting, completion controls, and other benefits of our webinar integration will not be available.',
	addAsResourceLink: 'Yes, add anyway.',
	multipleInstances: 'There is more than one occurrence of this webinar.  Please choose one.'
});

export default class WebinarRegistrationEditor extends React.Component {
	static propTypes = {
		context: PropTypes.object.isRequired,
		onLinkClick: PropTypes.func,
		onWebinarSelected: PropTypes.func,
		onAddAsExternalLink: PropTypes.func
	}

	state = {}

	renderStep (step, text) {
		return <div className="step"><div className="step-number">{step}</div><div className="step-content">{text}</div></div>;
	}

	renderSteps () {
		return (
			<div className="learn-more-content">
				<div className="steps-title">{t('steps')}</div>
				{this.renderStep(1, t('step1'))}
				{this.renderStep(2, t('step2'))}
				{this.renderStep(3, t('step3'))}
				{this.renderStep(4, t('step4'))}
			</div>
		);
	}

	showMoreInfo = () => {
		this.setState({learnMoreExpanded: true});
	}

	onSuccess = (webinars) => {
		const {onWebinarSelected} = this.props;

		if(webinars && webinars.length > 1) {
			this.setState({webinars});

			return;
		}

		if(onWebinarSelected) {
			onWebinarSelected(webinars[0]);
		}
	}

	onFailure = (e, inputValue) => {
		// TODO: Test inputValue against a URL pattern

		this.setState({error: e, externalLink: inputValue});
	}

	renderAddAsResource () {
		return (
			<div className="add-as-resource">
				<div className="title">{t('addAsResourceTitle')}</div>
				<div className="description">{t('addAsResourceDesc')}</div>
				<div className="add-link" onClick={() => {
					const {onAddAsExternalLink} = this.props;

					if(onAddAsExternalLink) {
						onAddAsExternalLink(this.state.externalLink);
					}
				}}>{t('addAsResourceLink')}</div>
			</div>
		);
	}

	renderPasteForm () {
		const {error, externalLink} = this.state;

		return (
			<div className="paste-form">
				<div className="title">{t('title')}</div>
				<div className="description">{t('description')}</div>
				{!this.state.learnMoreExpanded && <div onClick={this.showMoreInfo} className="learn-more">{t('learnMore')}</div>}
				{this.state.learnMoreExpanded && this.renderSteps()}
				<GotoWebinar.Input.Text context={this.props.context} onSuccess={this.onSuccess} onFailure={this.onFailure}/>
				{error && <div className="error">{error}</div>}
				{error && externalLink && this.renderAddAsResource()}
			</div>
		);
	}

	renderWebinarOption = (webinar) => {
		const {onWebinarSelected} = this.props;

		const item = {
			hasCompleted: () => false,
			webinar
		};

		return (
			<div className="webinar-option" onClick={() => {
				if(onWebinarSelected) {
					onWebinarSelected(webinar);
				}
			}}><BaseItem item={item} isMinimal hideControls/></div>
		);
	}


	renderChooseWebinar () {
		return (
			<div className="choose-webinar">
				<div className="title">{this.state.webinars[0].subject}</div>
				<div className="info">{t('multipleInstances')}</div>
				<div className="webinar-options">{this.state.webinars.map(this.renderWebinarOption)}</div>
			</div>
		);
	}

	render () {
		const {error, webinars} = this.state;

		const cls = cx('webinar-registration-editor', {error: Boolean(error)});

		return (
			<div className={cls}>
				<div className="link-bar">
					<span>{t('webinarLinkDesc')}</span>
					<span className="go-to-link" onClick={() => {
						if(this.props.onLinkClick) {
							this.props.onLinkClick();
						}
					}}>{t('pasteLink')}</span>
				</div>
				<div className="contents">
					{webinars && this.renderChooseWebinar()}
					{!webinars && this.renderPasteForm()}
				</div>
			</div>
		);
	}
}
