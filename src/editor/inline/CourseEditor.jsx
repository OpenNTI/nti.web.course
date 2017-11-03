import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'nti-web-commons';
import {getService} from 'nti-web-client';
import Video from 'nti-web-video';
import cx from 'classnames';

import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

import Section from './components/Section';
import { Identifier, Title, Description, Tags, StartDate, EndDate, MeetTimes,
	RedemptionCodes, Prerequisites, Department, Facilitators } from './components';

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
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func
	}

	constructor (props) {
		super(props);

		const catalogEntry = props.catalogEntry;

		this.state = {catalogEntry, loading: true};

		getService().then((service) => {
			return service.getObject(catalogEntry.CourseNTIID).then((courseInstance) => {
				courseInstance.getAccessTokens().then((tokens) => {
					let newState = {};

					newState.courseInstance = courseInstance;
					newState.redemptionCodes = tokens;

					newState.loading = false;

					this.setState(newState);
				});
			});
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
		// TODO: Figure out how to properly PUT assets on a catalog entry

		// const { editable } = this.props;
		// const { catalogEntry } = this.state;
		//
		// if(!editable) {
		// 	return null;
		// }
		//
		// return (
		// 	<Section
		// 		className="course-assets"
		// 		components={[Assets]}
		// 		catalogEntry={catalogEntry}/>
		// );
	}

	renderCourseVideo () {
		const { catalogEntry } = this.props;

		if(catalogEntry.Video) {
			return <Video src={catalogEntry.Video}/>;
		}

		return <div className="course-video-placeholder"/>;
	}

	render () {
		const { catalogEntry, editable } = this.props;
		const { activeEditor, loading } = this.state;

		if(loading) {
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
						components={[Prerequisites]}
						catalogEntry={catalogEntry}/>
					{this.renderRedemptionWidget()}
					<Section
						components={[StartDate]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.START_DATE}
						editable={editable}
						onBeginEditing={this.activateStartDateEditor}
						onEndEditing={this.endEditing}/>
					<Section
						components={[EndDate]}
						catalogEntry={catalogEntry}
						isEditing={activeEditor === EDITORS.END_DATE}
						editable={editable}
						onBeginEditing={this.activateEndDateEditor}
						onEndEditing={this.endEditing}/>
					<Section
						components={[Department]}
						catalogEntry={catalogEntry}/>
					<Section
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
						title="Facilitators"
						isEditing={activeEditor === EDITORS.FACILITATORS}
						onBeginEditing={this.activateFacilitatorsEditor}
						onEndEditing={this.endEditing}/>
				</div>
			</div>
		);
	}
}
