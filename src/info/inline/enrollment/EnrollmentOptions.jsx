import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';

import Store from './EnrollmentOptionsStore';
import {CustomExternalEnrollment, ExternalEnrollment, IMSEnrollment, OpenEnrollment, FiveMinuteEnrollment, StoreEnrollment} from './options';
import AddEnrollmentOption from './AddEnrollmentOption';
import {MIME_TYPES} from './common/OptionText';

const t = scoped('course.components.EnrollmentOptions', {
	enrollmentOptions: 'Enrollment',
	customize: 'Customize your Options',
	doneCustomizing: 'Done',
	addOption: 'Add an option'
});

const cmpMap = {
	[MIME_TYPES.OPEN]: OpenEnrollment,
	[MIME_TYPES.STORE]: StoreEnrollment,
	[MIME_TYPES.FIVE_MINUTE]: FiveMinuteEnrollment,
	[MIME_TYPES.CUSTOM_EXTERNAL]: CustomExternalEnrollment,
	[MIME_TYPES.EXTERNAL]: ExternalEnrollment,
	[MIME_TYPES.IMS]: IMSEnrollment
};

export default
@Store.connect({
	enrollmentOptions: 'enrollmentOptions',
	availableOptions: 'availableOptions',
	error: 'error'
})
class EnrollmentOptions extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
		enrollmentOptions: PropTypes.array,
		availableOptions: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.string
	}

	constructor (props) {
		super(props);
	}

	componentDidMount () {
		const {store, catalogEntry} = this.props;

		store.loadEnrollmentOptions(catalogEntry);
	}

	state = {}

	getCmpFor (option) {
		// default to open or return null?
		return cmpMap[option.MimeType];
	}

	renderOption (option, addable) {
		const Cmp = this.getCmpFor(option);

		if(!Cmp) {
			return;
		}

		return (
			<Cmp
				key={option.MimeType}
				option={option}
				editMode={this.state.editMode}
			/>
		);
	}

	renderExistingOption = (option, addable) => {
		return this.renderOption(option, false);
	}

	launchAddDialog = () => {
		AddEnrollmentOption.show(this.props.availableOptions, this.props.enrollmentOptions).then(selectedType => {
			this.props.store.addEnrollmentOption(selectedType);
		});
	}

	renderAddButton () {
		const {availableOptions} = this.props;

		if(!availableOptions || availableOptions.length === 0) {
			return null;
		}

		return <div className="add enrollment-card" onClick={this.launchAddDialog}><div className="icon">+</div><div className="text">{t('addOption')}</div></div>;
	}

	renderOptions () {
		const {enrollmentOptions} = this.props;

		return (
			<div className="options-list">
				{(enrollmentOptions || []).map(this.renderExistingOption)}
				{this.state.editMode && this.renderAddButton()}
			</div>
		);
	}

	enterEditMode = () => {
		this.setState({editMode: true});
	}

	exitEditMode = () => {
		this.setState({editMode: false});
	}

	renderCustomizeButton () {
		return <div className="customize-button" onClick={this.enterEditMode}>{t('customize')}</div>;
	}

	renderDoneCustomizingButton () {
		return <div className="customize-button" onClick={this.exitEditMode}>{t('doneCustomizing')}</div>;
	}

	canCustomize () {
		const {availableOptions, enrollmentOptions} = this.props;

		if(availableOptions && availableOptions.length > 0) {
			return true;
		}

		const editableOptions = (enrollmentOptions || []).filter(x => x.hasLink('edit'));

		return editableOptions.length > 0;
	}

	render () {
		const {loading} = this.props;

		if(loading) {
			return <Loading.Ellipsis/>;
		}

		return (
			<div className="enrollment-options">
				<div className="enrollment-options-title">
					<span>{t('enrollmentOptions')}</span>
					{!this.state.editMode && this.renderCustomizeButton()}
					{this.state.editMode && this.renderDoneCustomizingButton()}
				</div>
				{this.renderOptions()}
			</div>
		);
	}
}
