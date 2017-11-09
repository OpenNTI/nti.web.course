import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'nti-web-commons';
import {getService} from 'nti-web-client';
import Video, { EmbedInput, getCanonicalUrlFrom } from 'nti-web-video';
import cx from 'classnames';

import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

import { saveFacilitators, mergeAllFacilitators } from './components/facilitators/utils';
import Section from './components/Section';
import { Identifier, Title, Description, Tags, StartDate, EndDate, MeetTimes,
	RedemptionCodes, Prerequisites, Department, Facilitators, Assets } from './components';

const EDITORS = {
	COURSE_INFO: 'CourseInfo',
	START_DATE: 'StartDate',
	END_DATE: 'EndDate',
	MEET_TIMES: 'MeetTimes',
	FACILITATORS: 'Facilitators'
};

/**
 * Editor components are defined by the imports from ./components.  These components are grouped into Section components.
 * Currently, only one component can be in active editing mode at a time.
 */

export default class CourseEditor extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.any.isRequired,
		editable: PropTypes.bool,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func
	}

	constructor (props) {
		super(props);

		const catalogEntry = props.catalogEntry;

		this.state = {loading: true};

		if(typeof catalogEntry === 'string') {
			getService().then(service => {
				service.getObject(catalogEntry).then((value) => {
					// be flexible on the kind of data we're given
					this.initializeCourseData(value.CatalogEntry || value.CourseCatalogEntry || value);
				});
			});
		}
		else {
			this.initializeCourseData(catalogEntry);
		}
	}

	async initializeCourseData (catalogEntry) {
		const service = await getService();

		const courseInstance = await service.getObject(catalogEntry.CourseNTIID);

		const redemptionCodes = await courseInstance.getAccessTokens();

		const instructorsLink = courseInstance.getLink('Instructors');
		const editorsLink = courseInstance.getLink('Editors');

		const instructorsRaw = instructorsLink ? await service.get(instructorsLink) : [];
		const editorsRaw = editorsLink ? await service.get(editorsLink) : [];

		this.setState({
			catalogEntry,
			courseInstance,
			redemptionCodes,
			facilitators: mergeAllFacilitators(
				catalogEntry.Instructors,
				instructorsRaw && instructorsRaw.Items,
				editorsRaw && editorsRaw.Items),
			loading: false
		});
	}

	saveFacilitators = (pending) => {
		const facilitators = (pending || {}).facilitators;

		return saveFacilitators(this.state.catalogEntry, this.state.courseInstance, facilitators).then((saved) => {
			this.setState({ facilitators: saved });

			return saved;
		});
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = (data) => {
		if (data.type === COURSE_SAVING) {
			this.setState({loading: true});
		} else if (data.type === COURSE_SAVE_ERROR) {
			this.setState({loading: false, errorMsg: data.errorMsg});
		} else if (data.type === COURSE_SAVED) {
			this.setState({loading: false, hasSaved: true});
		}
	}

	activateCourseInfoEditor = () => {
		this.setState({activeEditor: EDITORS.COURSE_INFO});
	}

	activateStartDateEditor = () => {
		this.setState({activeEditor: EDITORS.START_DATE});
	}

	activateEndDateEditor = () => {
		this.setState({activeEditor: EDITORS.END_DATE});
	}

	activateMeetTimesEditor = () => {
		this.setState({activeEditor: EDITORS.MEET_TIMES});
	}

	activateFacilitatorsEditor = () => {
		this.setState({activeEditor: EDITORS.FACILITATORS});
	}

	endEditing = () => {
		this.setState({activeEditor: undefined});
	}

	renderRedemptionWidget () {
		const { editable } = this.props;
		const { redemptionCodes } = this.state;

		if(!editable) {
			return null;
		}

		return (
			<Section
				className="course-redemption-codes"
				components={[RedemptionCodes]}
				redemptionCodes={redemptionCodes}/>
		);
	}

	renderAssetUploadWidget () {
		const { editable } = this.props;
		const { catalogEntry } = this.state;

		if(!editable) {
			return null;
		}

		return (
			<Section
				className="course-assets"
				components={[Assets]}
				catalogEntry={catalogEntry}/>
		);
	}

	launchVideoInput = () => {
		EmbedInput.show().then((value) => {
			const src = getCanonicalUrlFrom(value);

			this.props.catalogEntry.save({
				Video: src
			}).then(() => {
				this.endEditing();
			});
		});
	}

	renderVideoEditor () {
		return (
			<div className="course-video-editor">
				<div className="video-button" onClick={this.launchVideoInput}>
					<div className="icon"/>
					<div className="label">Cover Video</div>
				</div>
			</div>
		);
	}

	renderCourseVideo () {
		const { catalogEntry } = this.state;

		if(this.state.activeEditor === EDITORS.COURSE_INFO) {
			return this.renderVideoEditor();
		}

		if(catalogEntry.Video) {
			return <Video src={catalogEntry.Video}/>;
		}

		return <div className="course-video-placeholder"/>;
	}

	render () {
		const { editable } = this.props;
		const { activeEditor, catalogEntry, courseInstance, facilitators, loading } = this.state;

		if(loading || !catalogEntry) {
			return (<Loading.Mask/>);
		}

		const classname = cx('course-inline-editor', { 'view-only' : !editable });

		return (
			<div className={classname}>
				{this.renderCourseVideo()}
				<div className="sections">
					<Section
						className="basic-info-section"
						components={[Identifier, Title, Description, Tags]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.COURSE_INFO}
						editable={editable}
						onBeginEditing={this.activateCourseInfoEditor}
						onEndEditing={this.endEditing}
						inlinePlacement
						hideDeleteBlock/>
					{this.renderAssetUploadWidget()}
					<Section
						className="prerequisites-section"
						components={[Prerequisites]}
						catalogEntry={catalogEntry}/>
					{this.renderRedemptionWidget()}
					<Section
						className="start-date-section"
						components={[StartDate]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.START_DATE}
						editable={editable}
						onBeginEditing={this.activateStartDateEditor}
						onEndEditing={this.endEditing}/>
					<Section
						className="end-date-section"
						components={[EndDate]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.END_DATE}
						editable={editable}
						onBeginEditing={this.activateEndDateEditor}
						onEndEditing={this.endEditing}/>
					<Section
						className="department-section"
						components={[Department]}
						catalogEntry={catalogEntry}/>
					<Section
						className="meet-times-section"
						components={[MeetTimes]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.MEET_TIMES}
						editable={editable}
						onBeginEditing={this.activateMeetTimesEditor}
						onEndEditing={this.endEditing}/>
					<Section
						className="facilitators-section"
						components={[Facilitators]}
						catalogEntry={catalogEntry}
						courseInstance={courseInstance}
						facilitators={facilitators}
						title="Facilitators"
						editable={editable}
						isEditing={activeEditor === EDITORS.FACILITATORS}
						onBeginEditing={this.activateFacilitatorsEditor}
						onEndEditing={this.endEditing}
						doSave={this.saveFacilitators}/>
				</div>
			</div>
		);
	}
}
