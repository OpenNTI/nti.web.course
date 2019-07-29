import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import cx from 'classnames';

import {InfoPanel} from '../../admin-tools';
import Store from '../../editor/Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../../editor/Constants';

import CourseVisibility from './enrollment/CourseVisibility';
import CourseVideo from './widgets/CourseVideo';
import { saveFacilitators, mergeAllFacilitators } from './components/facilitators/utils';
import Section from './components/Section';
import { Identifier, Title, Description, Tags, StartDate, EndDate, MeetTimes,
	RedemptionCodes, Prerequisites, Department, Facilitators, Assets, TranscriptCredit } from './components';
import {TechSupport} from './components/techsupport';


const EDITORS = {
	COURSE_INFO: 'CourseInfo',
	START_DATE: 'StartDate',
	END_DATE: 'EndDate',
	MEET_TIMES: 'MeetTimes',
	FACILITATORS: 'Facilitators',
	TRANSCRIPT_CREDIT: 'TranscriptCredit',
	REDEMPTION_CODES: 'RedemptionCodes'
};

/**
 * Editor components are defined by the imports from ./components.  These components are grouped into Section components.
 * Currently, only one component can be in active editing mode at a time.
 */

export default class CourseInfo extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.any.isRequired,
		editable: PropTypes.bool,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func,
		hasAdminToolsAccess: PropTypes.bool
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

	getCourseInstance (service, catalogEntry) {
		return service.getObject(catalogEntry.CourseNTIID).then((courseInstance) => {
			return courseInstance;
		}).catch(() => {
			return null;
		});
	}

	async initializeCourseData (catalogEntry) {
		const service = await getService();

		const courseInstance = await this.getCourseInstance(service, catalogEntry);

		let redemptionCodes = null;

		try {
			redemptionCodes = courseInstance ? await courseInstance.getAccessTokens() : null;
		} catch (e) {
			// some users may not have access to the tokens
			redemptionCodes = null;
		}

		const accessLink = catalogEntry.getLink('UserCoursePreferredAccess');

		let enrollmentAccess;

		try {
			enrollmentAccess = accessLink ? await service.get(accessLink) : null;
		} catch (e) {
			// may not have access at all
			enrollmentAccess = null;
		}

		this.setState({
			catalogEntry,
			courseInstance,
			redemptionCodes,
			enrollmentAccess,
			hasMoreFacilitators: courseInstance.hasLink('Instructors') || courseInstance.hasLink('Editors'),
			facilitators: mergeAllFacilitators(
				catalogEntry.Instructors,
				[],
				[],
				catalogEntry),
			loading: false
		});
	}

	saveFacilitators = (pending) => {
		const facilitators = (pending || {}).facilitators;

		if(!pending || !facilitators) {
			return Promise.resolve();
		}

		return saveFacilitators(this.state.catalogEntry, this.state.courseInstance, facilitators).then((saved) => {
			this.setState({ facilitators: saved });

			return this.state.catalogEntry;
		});
	}

	saveTranscriptCredits = (values) => {
		// TODO: Save changes to course

		return Promise.resolve();
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}

	componentDidUpdate (prevProps) {
		const {catalogEntry} = this.props;
		if(prevProps.catalogEntry !== catalogEntry) {
			this.setState({catalogEntry});
		}
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

	hideFullFacilitatorSet = async () => {
		this.setState({
			showingFullFacilitatorSet: false
		});
	}

	showFullFacilitatorSet = async () => {
		this.loadFullFacilitatorsSet({showingFullFacilitatorSet: true});
	}

	loadFullFacilitatorsSet = async (extraState = {}) => {
		const {
			catalogEntry,
			courseInstance,
			facilitatorsFullyLoaded,
			loadingFullFacilitators
		} = this.state;

		if (facilitatorsFullyLoaded || loadingFullFacilitators) {
			this.setState(extraState);
			return;
		}

		this.setState({
			loadingFullFacilitators: true
		});

		try {
			const service = await getService();

			const instructorsLink = courseInstance ? courseInstance.getLink('Instructors') : null;
			const editorsLink = courseInstance ? courseInstance.getLink('Editors') : null;

			const instructorsRaw = instructorsLink ? await service.get(instructorsLink) : [];
			const editorsRaw = editorsLink ? await service.get(editorsLink) : [];


			this.setState({
				...extraState,
				loadingFullFacilitators: false,
				facilitatorsFullyLoaded: true,
				facilitators: mergeAllFacilitators(
					catalogEntry.Instructors,
					instructorsRaw && instructorsRaw.Items,
					editorsRaw && editorsRaw.Items,
					catalogEntry
				)
			});
		} catch (e) {
			this.setState({
				...extraState,
				loadingFullFacilitators: false
			});
		}
	}

	activateFacilitatorsEditor = async () => {
		this.setState({
			showingFacilitatorEditor: true,
		}, () => {
			this.loadFullFacilitatorsSet({activeEditor: EDITORS.FACILITATORS, showingFacilitatorEditor: false});
		});
	}

	activateTranscriptCreditEditor = () => {
		this.setState({activeEditor: EDITORS.TRANSCRIPT_CREDIT});
	}

	activateRedemptionEditor = () => {
		this.setState({ activeEditor: EDITORS.REDEMPTION_CODES });
	}

	endEditing = (savedCatalogEntry) => {
		const { onSave } = this.props;

		this.setState({activeEditor: undefined});

		if(savedCatalogEntry) {
			onSave && onSave(savedCatalogEntry);
		}
	}

	endCodeEditing = async () => {
		const { courseInstance, catalogEntry } = this.state;
		const redemptionCodes = await courseInstance.getAccessTokens();
		this.setState({ redemptionCodes });

		this.endEditing(catalogEntry);
	}

	renderRedemptionWidget () {
		const { editable } = this.props;
		const { redemptionCodes, activeEditor, courseInstance } = this.state;

		let canCreate = courseInstance && courseInstance.hasLink('CreateCourseInvitation');

		if(!editable) {
			return null;
		}

		return (
			<Section
				className="course-redemption-codes"
				components={[RedemptionCodes]}
				redemptionCodes={redemptionCodes}
				courseInstance={courseInstance}
				editable={editable && canCreate}
				isEditing={activeEditor === EDITORS.REDEMPTION_CODES}
				onBeginEditing={this.activateRedemptionEditor}
				onEndEditing={this.endCodeEditing}
				hideDeleteBlock
				hideCancel
				done
			/>
		);
	}

	endAssetEditing = (catalogEntry) => {
		this.endEditing(catalogEntry);

		this.setState({ uploadCompleting: true }, () => {
			this.setState({ uploadCompleting: false });
		});
	}

	renderAssetUploadWidget () {
		const { editable } = this.props;
		const { catalogEntry, uploadCompleting } = this.state;

		if(!editable) {
			return null;
		}

		if(uploadCompleting) {
			return <Loading.Mask/>;
		}

		return (
			<Section
				className="course-assets"
				components={[Assets]}
				catalogEntry={catalogEntry}
				onEndEditing={this.endAssetEditing}/>
		);
	}

	onSetVideo = (src) => {
		this.state.catalogEntry.save({
			Video: src
		}).then(() => {
			this.endEditing();
		});
	}

	onRemoveVideo = () => {
		this.state.catalogEntry.save({
			Video: null
		}).then(() => {
			this.endEditing();
		});
	}

	renderCourseVisibilityWidget () {
		const { editable } = this.props;
		const { catalogEntry, courseInstance } = this.state;

		if(editable) {
			return <CourseVisibility catalogEntry={catalogEntry} courseInstance={courseInstance} onVisibilityChanged={this.endEditing}/>;
		}
	}

	render () {
		const { editable, hasAdminToolsAccess } = this.props;
		const {
			activeEditor,
			catalogEntry,
			courseInstance,
			enrollmentAccess,
			facilitators,
			hasMoreFacilitators,
			showingFacilitatorEditor,
			showingFullFacilitatorSet,
			loadingFullFacilitators,
			loading
		} = this.state;

		if(loading || !catalogEntry) {
			return (<div className="course-inline-editor loading"><Loading.Mask/></div>);
		}

		const classname = cx('course-inline-editor', { 'view-only' : !editable });

		return (
			<div className={classname}>
				{this.renderCourseVisibilityWidget()}
				<CourseVideo
					catalogEntry={catalogEntry}
					editable={editable}
					onSetVideo={this.onSetVideo}
					onRemoveVideo={this.onRemoveVideo}/>
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
						className="transcript-credits-section"
						components={[TranscriptCredit]}
						catalogEntry={catalogEntry}
						enrollmentAccess={enrollmentAccess}
						editable={editable}
						isEditing={activeEditor === EDITORS.TRANSCRIPT_CREDIT}
						onBeginEditing={this.activateTranscriptCreditEditor}
						onEndEditing={this.endEditing}/>
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
						doSave={this.saveFacilitators}
						hasMoreFacilitators={hasMoreFacilitators}
						showingFacilitatorEditor={showingFacilitatorEditor}
						showingFullFacilitatorSet={showingFullFacilitatorSet}
						loadingFullFacilitators={loadingFullFacilitators}
						showFullFacilitatorSet={this.showFullFacilitatorSet}
						hideFullFacilitatorSet={this.hideFullFacilitatorSet}
						hideDeleteBlock/>
				</div>
				<TechSupport />
				{hasAdminToolsAccess && <InfoPanel {...this.props}/>}
			</div>
		);
	}
}
