import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Prompt, Loading } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import CourseMeta from '../CourseMeta';
import DayTime from '../DayTime';
import CourseDatesPicker from '../CourseDatesPicker';
import {getImageUrl} from '../utils';
import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

const LABELS = {
	finish: 'Finish',
	getStarted: 'Get Started',
	dayAndTime: 'Day & Time',
	chooseCourseDates: 'Choose Course Dates',
	saving: 'Saving...',
	save: 'Save',
};

const t = scoped('COURSE_EDITOR', LABELS);

export default class CourseEditor extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func
	}

	static showEditor (catalogEntry, onCancel, onSave) {
		const doCancel = () => {
			onCancel && onCancel();
		};

		const doOnSave = () => {
			onSave && onSave();
		};

		return Prompt.modal(<CourseEditor catalogEntry={catalogEntry}  onCancel={doCancel} onSave={doOnSave}/>,
			'course-panel-wizard');
	}

	constructor (props) {
		super(props);

		this.state = {};
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
			this.setState({loading: false});
		}
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	};

	renderLoadingMask () {
		if(this.state.loading) {
			return (<Loading.Mask message={t('saving')}/>);
		}

		return null;
	}

	renderCloseButton () {
		return (<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>);
	}

	render () {
		const { catalogEntry, onSave } = this.props;

		return (<div className="course-editor">
			{this.renderLoadingMask()}
			{this.renderCloseButton()}
			<Switch.Panel className="course-panel" active="CourseMeta">
				<Switch.Controls className="course-editor-menu">
					<div className="course-image" style={{
						backgroundImage: 'url(' + getImageUrl(catalogEntry) + ')'
					}}/>
					<div className="course-id">{catalogEntry.ProviderUniqueID}</div>
					<div className="course-title">{catalogEntry.title}</div>
					<Switch.Trigger className="course-editor-menu-item" item="CourseMeta">Basic Information</Switch.Trigger>
					<Switch.Trigger className="course-editor-menu-item" item="DayTime">Times</Switch.Trigger>
					<Switch.Trigger className="course-editor-menu-item" item="CourseDatesPicker">Dates</Switch.Trigger>
				</Switch.Controls>
				<Switch.Container>
					<Switch.Item
						className="course-panel-content"
						name="CourseMeta"
						component={CourseMeta}
						catalogEntry={catalogEntry}
						onCancel={this.cancel}
						afterSave={onSave}
						saveCmp={SaveButton}/>
					<Switch.Item
						className="course-panel-content"
						name="DayTime"
						component={DayTime}
						catalogEntry={catalogEntry}
						onCancel={this.cancel}
						afterSave={onSave}
						saveCmp={SaveButton}/>
					<Switch.Item
						className="course-panel-content"
						name="CourseDatesPicker"
						component={CourseDatesPicker}
						catalogEntry={catalogEntry}
						onCancel={this.cancel}
						afterSave={onSave}
						saveCmp={SaveButton}/>
				</Switch.Container>
			</Switch.Panel>
		</div>);
	}
}

SaveButton.propTypes = {
	onSave: PropTypes.func,
	label: PropTypes.string
};

function SaveButton ({onSave, label}) {
	return (
		<div onClick={onSave} className="course-panel-continue">{label || t('save')}</div>
	);
}
