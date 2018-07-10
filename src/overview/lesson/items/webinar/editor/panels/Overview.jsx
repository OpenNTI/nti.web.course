import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, RemoveButton} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageEditor} from '@nti/web-whiteboard';

import PositionSelect from '../../../../common/PositionSelect';

import EditImage from './EditImage';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.Overview', {
	save: 'Add to Lesson',
	cancel: 'Cancel',
	position: 'Position',
	autoCompletion: 'Auto Completion',
	autoCompletionDesc: 'Define what is required for learners to complete this webinar.',
	requiredSubmissions: 'Required Submissions',
	minimumPercentWatched: 'Minimum Percent Watched',
	infoTip: 'Guarantee all learners have access to your content by reviewing your GoToWebinar registration and attendee limits.'
});

export default class WebinarOverviewEditor extends React.Component {
	static propTypes = {
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func
	}

	state = {}

	renderDate () {
		return <div className="date"><div className="month">Dec</div><div className="day">22</div></div>;
	}

	onImageUpload = async (editorState) => {
		const img = await ImageEditor.getImageForEditorState(editorState);

		this.setState({editorState: img}, () => {
			EditImage.show(ImageEditor.getEditorState(img, {crop: {width: img.naturalWidth, height: img.naturalHeight}})).then((newImg) => {
				this.onImageCropperSave(newImg);
			}).catch(() => {
				this.setState({editorState: null});
			});
		});
	}

	onImageCropperSave = async (img) => {
		this.setState({img});
	}

	renderWebinarInfo () {
		// TODO: Populate with actual webinar info, not the plot to Hard Ticket to Hawaii
		return (
			<div className="webinar-info">
				<div className="title">Never Settle: Using LinkedIn for Brand Marketing</div>
				<div className="time-info">Live 2HR Webinar Sunday at 1:30 PM PDT</div>
				<div className="image-and-description">
					{this.renderImage()}
					<div className="description">Two drug enforcement agents are killed on a private Hawaiian island. Donna and Taryn, two operatives for The Agency (Molokai Cargo), accidentally intercept a delivery of diamonds intended for drug lord Seth Romero, who takes exception and tries to get them back. Soon other Agency operatives get involved, and a full-scale fight to the finish ensues, complicated here and there by a contaminated snake made deadly by toxic cancer-infested rats!</div>
				</div>
			</div>
		);
	}

	renderImage () {
		if(!this.state.img && !this.state.editorState) {
			return (
				<div className="image-upload-container">
					<ImageEditor.Editor onChange={this.onImageUpload}/>
					<div className="content">
						<i className="icon-upload"/>
						<div className="text">Add an Image</div>
					</div>
				</div>
			);
		}

		if(this.state.img) {
			return (
				<div className="image-preview">
					<img src={this.state.img.src}/>
					<div className="remove-image">
						<RemoveButton onRemove={() => {this.setState({img: null, editorState: null});}}/>
					</div>
				</div>
			);
		}
	}

	renderInfoBanner () {
		if(this.state.hideBanner) {
			return null;
		}

		return (
			<div className="info-banner">
				<div className="info-text">{t('infoTip')}</div>
				<RemoveButton onRemove={() => { this.setState({hideBanner: true}); }}/>
			</div>
		);
	}

	onPositionChange = (selectedSection, selectedRank) => {
		this.setState({selectedSection, selectedRank});
	}

	renderPosition () {
		return (
			<div className="position-section">
				<div className="section-title">{t('position')}</div>
				<PositionSelect lessonOverview={this.props.lessonOverview} overviewGroup={this.props.overviewGroup} onChange={this.onPositionChange}/>
			</div>
		);
	}

	// renderAutoCompletion () {
	// 	// TODO: Not finished. Come back to this implementation later
	//
	// 	return (
	// 		<div className="auto-completion-section">
	// 			<div className="section-title">{t('autoCompletion')}</div>
	// 			<div className="section-description">{t('autoCompletionDesc')}</div>
	// 			<div className="options">
	// 				<div className="submissions">
	// 					<div className="subsection-title">{t('requiredSubmissions')}</div>
	// 				</div>
	// 				<div className="percentage">
	// 					<div className="subsection-title">{t('minimumPercentWatched')}</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	renderOtherInfo () {
		return (
			<div className="other-info">
				{this.renderPosition()}
				{/* {this.renderAutoCompletion()} */}
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
			// gather up state from position select and anything else?
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
