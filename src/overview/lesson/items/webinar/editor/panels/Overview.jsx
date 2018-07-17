import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, RemoveButton, DateTime, Prompt} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageEditor} from '@nti/web-whiteboard';

import PositionSelect from '../../../../common/PositionSelect';

import EditImage from './EditImage';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.Overview', {
	addToLesson: 'Add to Lesson',
	save: 'Save',
	cancel: 'Cancel',
	position: 'Position',
	autoCompletion: 'Auto Completion',
	autoCompletionDesc: 'Define what is required for learners to complete this webinar.',
	requiredSubmissions: 'Required Submissions',
	minimumPercentWatched: 'Minimum Percent Watched',
	infoTip: 'Guarantee all learners have access to your content by reviewing your GoToWebinar registration and attendee limits.',
	delete: 'Delete'
});

export default class WebinarOverviewEditor extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		webinar: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func,
		onDelete: PropTypes.func
	}

	state = {}

	constructor (props) {
		super(props);

		const nearestSession = props.webinar.getNearestSession();

		this.state = {
			startDate: nearestSession && nearestSession.getStartTime(),
			endDate: nearestSession && nearestSession.getEndTime(),
			selectedSection: props.overviewGroup,
			selectedRank: (props.overviewGroup.Items || []).length + 1,
			webinar: props.webinar
		};
	}

	renderDate () {
		const {startDate} = this.state;

		return (
			<div className="date">
				<div className="month">{DateTime.format(startDate, 'MMM')}</div>
				<div className="day">{DateTime.format(startDate, 'D')}</div>
			</div>
		);
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
		const {webinar} = this.props;
		const {startDate, endDate} = this.state;

		let info = '';

		if(startDate && endDate) {
			const timeDiff = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60;

			info = timeDiff + 'HR';
		}

		return (
			<div className="webinar-info">
				<div className="title">{webinar.subject}</div>
				<div className="time-info">Live {info} Webinar {DateTime.format(startDate, 'dddd [at] hh:mm a z')}</div>
				<div className="image-and-description">
					{this.renderImage()}
					<div className="description">{webinar.description}</div>
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
				<PositionSelect item={this.props.item} lessonOverview={this.props.lessonOverview} overviewGroup={this.state.selectedSection} onChange={this.onPositionChange}/>
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


	onDelete = () => {
		const {onDelete} = this.props;

		Prompt.areYouSure('Do you want to remove this webinar from the lesson?').then(() => {
			onDelete();
		});
	}

	renderOtherInfo () {
		const {onDelete} = this.props;

		return (
			<div className="other-info">
				{this.renderPosition()}
				{onDelete && <div className="delete-button" onClick={() => { onDelete(); }}>{t('delete')}</div>}
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
		const {selectedSection, selectedRank, img, webinar} = this.state;

		if(onAddToLesson) {
			onAddToLesson(selectedSection, selectedRank, img, webinar);
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
						label: this.props.item ? t('save') : t('addToLesson'),
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
