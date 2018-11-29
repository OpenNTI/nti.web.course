import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, RemoveButton, DateTime, Prompt, Input, Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageEditor} from '@nti/web-whiteboard';
import {Connectors} from '@nti/lib-store';
import cx from 'classnames';

import PositionSelect from '../../../common/PositionSelect';

import DateInput from './DateInput';
import EditImage from './EditImage';

const t = scoped('course.overview.lesson.items.event.common.Overview', {
	addToLesson: 'Add to Lesson',
	addAnImage: 'Add an Image',
	eventTitle: 'Event Title',
	eventDescription: 'Description...',
	eventLocation: 'Location',
	save: 'Save',
	cancel: 'Cancel',
	position: 'Position',
	location: 'Location',
	datesTimes: 'Dates & Times',
	delete: 'Delete',
	event: 'Event',
	areYouSure: 'Do you want to remove this event from the lesson?',
	start: 'Start',
	end: 'End'
});

export default
@Connectors.Any.connect(['createEvent', 'createError', 'saving'])
class EventOverviewEditor extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		item: PropTypes.object,
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		event: PropTypes.object,
		onCancel: PropTypes.func,
		onAddToLesson: PropTypes.func,
		onDelete: PropTypes.func,
		createEvent: PropTypes.func,
		createError: PropTypes.string,
		saveDisabled: PropTypes.bool,
		saving: PropTypes.bool
	}

	attachDateFlyoutRef = x => this.dateFlyout = x

	state = {}

	constructor (props) {
		super(props);

		const {event} = props;

		let defaultStartDate = new Date();
		defaultStartDate.setSeconds(0);
		defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 59);
		defaultStartDate.setMinutes(0);

		this.state = {
			startDate: event ? event.getStartTime() : defaultStartDate,
			endDate: event ? event.getEndTime() : new Date(defaultStartDate.getTime() + (60 * 60 * 1000)),
			title: event && event.title,
			description: event && event.description,
			location: event && event.location,
			selectedSection: props.overviewGroup,
			selectedRank: (props.overviewGroup.Items || []).length + 1,
			event: props.event,
			// check icon for null string.  if we remove an icon and PUT to the record, it won't be null, but "null"
			img: props.item && props.item.icon && props.item.icon !== 'null' && {src: props.item.icon}
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
			// match aspectRatio to the dimensions of the image in event overview list items
			EditImage.show(ImageEditor.getEditorState(img, {crop: {aspectRatio: 208 / 117, width: img.naturalWidth, height: img.naturalHeight}})).then((newEditorState) => {
				ImageEditor.getImageForEditorState(newEditorState).then(newImg => {
					this.onImageCropperSave(newImg, newEditorState);
				});
			}).catch(() => {
				this.setState({editorState: null});
			});
		});
	}

	onImageCropperSave = async (img, croppedImageState) => {
		this.setState({img, croppedImageState});
	}

	renderEventInfo () {
		const {startDate, title, description} = this.state;

		return (
			<div className="event-info">
				<div className="title"><Input.Text placeholder={t('eventTitle')} value={title} onChange={(val) => this.setState({title: val})} maxLength="140"/></div>
				<div className="time-info">
					<span className="date">{DateTime.format(startDate, 'dddd [at] hh:mm a z')}</span>
				</div>
				<div className="image-and-description">
					{this.renderImage()}
					<Input.TextArea value={description} onChange={(val) => this.setState({description: val})} placeholder={t('eventDescription')}/>
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
						<div className="text">{t('addAnImage')}</div>
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

	onPositionChange = (selectedSection, selectedRank) => {
		this.setState({selectedSection, selectedRank});
	}

	renderPosition () {
		return (
			<div className="input-section position">
				<div className="section-title">{t('position')}</div>
				<PositionSelect item={this.props.item} lessonOverview={this.props.lessonOverview} overviewGroup={this.state.selectedSection} onChange={this.onPositionChange}/>
			</div>
		);
	}

	renderLocation () {
		const {location} = this.state;

		return (
			<div className="input-section location">
				<div className="section-title">{t('location')}</div>
				<Input.Text placeholder={t('eventLocation')} value={location} onChange={(val) => this.setState({location: val})} maxLength="140"/>
			</div>
		);
	}

	renderDateInputs () {
		return (
			<div className="input-section times">
				<div className="section-title">{t('datesTimes')}</div>
				<DateInput date={this.state.startDate} label={t('start')} onChange={(val) => this.setState({startDate: val})}/>
				<DateInput date={this.state.endDate} label={t('end')} onChange={(val) => this.setState({endDate: val})}/>
			</div>
		);
	}

	onDelete = () => {
		const {onDelete} = this.props;

		Prompt.areYouSure(t('areYouSure')).then(() => {
			onDelete();
		});
	}

	renderOtherInfo () {
		const {onDelete} = this.props;

		return (
			<div className="other-info">
				{this.renderPosition()}
				{this.renderLocation()}
				{this.renderDateInputs()}
				{onDelete && <div className="delete-button" onClick={() => { this.onDelete(); }}>{t('delete')}</div>}
			</div>
		);
	}

	onCancel = () => {
		const {onCancel} = this.props;

		if(onCancel) {
			onCancel();
		}
	}

	async getBlobForImage () {
		const {croppedImageState, img} = this.state;

		const request = croppedImageState ? ImageEditor.getBlobForEditorState(croppedImageState) : Promise.resolve();

		const dataBlob = await request;
		let blobValue = null;

		if(img && !dataBlob) {
			blobValue = undefined; // an image was provided, but no changes were made
		}
		else {
			blobValue = dataBlob || null;
		}

		return blobValue;
	}

	onSave = async () => {
		const {onAddToLesson, course, event, createEvent} = this.props;
		const {selectedSection, selectedRank, title, description, location, startDate, endDate} = this.state;

		const blobValue = await this.getBlobForImage();
		const calendarEvent = await createEvent(course, event, title, description, location, startDate, endDate, blobValue);

		if(calendarEvent) {
			onAddToLesson(selectedSection, selectedRank, blobValue, calendarEvent);
		}
	}

	renderButtons () {
		const {saveDisabled} = this.props;

		return (
			<DialogButtons
				buttons={[
					{
						label: t('cancel'),
						onClick: this.onCancel,
					},
					{
						label: this.props.item ? t('save') : t('addToLesson'),
						disabled: saveDisabled,
						onClick: this.onSave
					}
				]}
			/>
		);
	}

	renderError () {
		const {createError} = this.props;

		if(createError) {
			return <div className="error">{createError}</div>;
		}
	}

	render () {
		const {saving, saveDisabled} = this.props;

		const cls = cx('event-overview-editor', {saving: saving || saveDisabled});

		return (
			<div className={cls}>
				{this.renderError()}
				{saving && <Loading.Mask/>}
				<div className="contents">
					<div className="header-info">
						{this.renderDate()}
						{this.renderEventInfo()}
					</div>
					{this.renderOtherInfo()}
				</div>
				{this.renderButtons()}
			</div>
		);
	}
}
