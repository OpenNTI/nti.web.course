import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.Overview', {
	save: 'Add to Lesson',
	cancel: 'Cancel',
	position: 'Position',
	autoCompletion: 'Auto Completion',
	autoCompletionDesc: 'Define what is required for learners to complete this webinar.',
	requiredSubmissions: 'Required Submissions',
	minimumPercentWatched: 'Minimum Percent Watched'
});

export default class WebinarOverviewEditor extends React.Component {
	static propTypes = {
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func
	}

	renderDate () {
		return <div className="date"><div className="month">Dec</div><div className="day">22</div></div>;
	}

	renderWebinarInfo () {
		return (
			<div className="webinar-info">
				<div className="title">Never Settle: Using LinkedIn for Brand Marketing</div>
				<div className="time-info">Live 2HR Webinar Sunday at 1:30 PM PDT</div>
				<div className="image-and-description">
					<div className="image-upload"/>
					<div className="description">Two drug enforcement agents are killed on a private Hawaiian island. Donna and Taryn, two operatives for The Agency (Molokai Cargo), accidentally intercept a delivery of diamonds intended for drug lord Seth Romero, who takes exception and tries to get them back. Soon other Agency operatives get involved, and a full-scale fight to the finish ensues, complicated here and there by a contaminated snake made deadly by toxic cancer-infested rats!</div>
				</div>
			</div>
		);
	}

	renderInfoBanner () {
		return (
			<div className="info-banner">
				<div className="info-text">Guarantee all learners have access to your content by reviewing your GoToWebinar registration and attendee limits.</div>
			</div>
		);
	}

	renderPosition () {
		return (
			<div className="position-section">
				<div className="section-title">{t('position')}</div>
			</div>
		);
	}

	renderAutoCompletion () {
		return (
			<div className="auto-completion-section">
				<div className="section-title">{t('autoCompletion')}</div>
				<div className="section-description">{t('autoCompletionDesc')}</div>
				<div className="options">
					<div className="submissions">
						<div className="subsection-title">{t('requiredSubmissions')}</div>
					</div>
					<div className="percentage">
						<div className="subsection-title">{t('minimumPercentWatched')}</div>
					</div>
				</div>
			</div>
		);
	}

	renderOtherInfo () {
		return (
			<div className="other-info">
				{this.renderPosition()}
				{this.renderAutoCompletion()}
			</div>
		);
	}

	onCancel = () => {
		const {onCancel} = this.props;

		if(onCancel) {
			onCancel();
		}
	}

	onSave = () => {
		const {onAddToLesson} = this.props;

		if(onAddToLesson) {
			onAddToLesson();
		}
	}

	renderButtons () {
		return (
			<DialogButtons
				buttons={[
					{
						label: t('cancel'),
						onClick: this.onCancel,
					},
					{
						label: t('save'),
						onClick: this.onSave
					}
				]}
			/>
		);
	}

	render () {
		return (
			<div className="webinar-overview-editor">
				<div className="header-info">
					{this.renderDate()}
					{this.renderWebinarInfo()}
				</div>
				{this.renderInfoBanner()}
				{this.renderOtherInfo()}
				{this.renderButtons()}
			</div>
		);
	}
}
