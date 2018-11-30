import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, DateTime, Prompt, Input, Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageUpload} from '@nti/web-whiteboard';
import {Connectors} from '@nti/lib-store';
import cx from 'classnames';

import PositionSelect from '../../../common/PositionSelect';

import DateInput from './DateInput';

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
			img: props.event && props.event.icon && props.event.icon !== 'null' && {src: props.event.icon}
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

	renderEventInfo () {
		const {startDate, title, description, img} = this.state;

		return (
			<div className="event-info">
				<div className="title"><Input.Text placeholder={t('eventTitle')} value={title} onChange={(val) => this.setState({title: val})} maxLength="140"/></div>
				<div className="time-info">
					<span className="date">{DateTime.format(startDate, 'dddd [at] hh:mm a z')}</span>
				</div>
				<div className="image-and-description">
					<ImageUpload img={img} onChange={imgBlob => this.setState({imgBlob})}/>
					<Input.TextArea value={description} onChange={(val) => this.setState({description: val})} placeholder={t('eventDescription')}/>
				</div>
			</div>
		);
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

	onSave = async () => {
		const {onAddToLesson, course, event, createEvent} = this.props;
		const {selectedSection, selectedRank, title, description, location, startDate, endDate, imgBlob} = this.state;

		const calendarEvent = await createEvent(course, event, title, description, location, startDate, endDate, imgBlob);

		if(calendarEvent) {
			onAddToLesson(selectedSection, selectedRank, imgBlob, calendarEvent);
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
