import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input} from '@nti/web-commons';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.NotConnected', {
	title: 'Paste or Enter a Registration Link',
	description: 'After you create a webinar in GoToWebinar you can add it to your course by providing a registration link.',
	learnMore: 'Learn More',
	steps: 'Steps',
	step1: 'Login to GoToWebinar and navigate to "My Webinars"',
	step2: 'Find the webinar you want to add',
	step3: 'Click "Share"',
	step4: 'Click "Copy Registration Link"',
	placeholder: 'Enter or paste a webinar key'
});

export default class WebinarRegistrationEditor extends React.Component {
	static propTypes = {

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

	onTextChange = (val) => {
		this.setState({key: val});
	}

	render () {
		return (
			<div className="webinar-registration-editor">
				<div className="title">{t('title')}</div>
				<div className="description">{t('description')}</div>
				{!this.state.learnMoreExpanded && <div onClick={this.showMoreInfo} className="learn-more">{t('learnMore')}</div>}
				{this.state.learnMoreExpanded && this.renderSteps()}
				<Input.Text value={this.state.key} onChange={this.onTextChange} placeholder={t('placeholder')}/>
			</div>
		);
	}
}
