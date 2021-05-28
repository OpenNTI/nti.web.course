import './EnrollmentOptions.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Loading, Input } from '@nti/web-commons';

import Store from './EnrollmentOptionsStore';
import {
	CustomExternalEnrollment,
	ExternalEnrollment,
	IMSEnrollment,
	OpenEnrollment,
	FiveMinuteEnrollment,
	StoreEnrollment,
} from './options';
import AddEnrollmentOption from './AddEnrollmentOption';
import { MIME_TYPES } from './common/OptionText';

const t = scoped('course.components.EnrollmentOptions', {
	enrollmentOptions: 'Enrollment',
	customize: 'Customize your Options',
	doneCustomizing: 'Done',
	addOption: 'Add an option',
	allowOpen: 'Allow Open Enrollment',
	allowCustomExternal: 'Allow External Enrollment',
	emptyText: 'There are no enrollment options available.',
});

const cmpMap = {
	[MIME_TYPES.OPEN]: OpenEnrollment,
	[MIME_TYPES.STORE]: StoreEnrollment,
	[MIME_TYPES.FIVE_MINUTE]: FiveMinuteEnrollment,
	[MIME_TYPES.CUSTOM_EXTERNAL]: CustomExternalEnrollment,
	[MIME_TYPES.EXTERNAL]: ExternalEnrollment,
	[MIME_TYPES.IMS]: IMSEnrollment,
};

class EnrollmentOptions extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		courseInstance: PropTypes.object.isRequired,
		allowOpenEnrollment: PropTypes.bool,
		store: PropTypes.object.isRequired,
		enrollmentOptions: PropTypes.array,
		availableOptions: PropTypes.array,
		loading: PropTypes.bool,
		warning: PropTypes.string,
		error: PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { store, catalogEntry, courseInstance } = this.props;

		store.loadEnrollmentOptions(catalogEntry, courseInstance);
	}

	state = {};

	resolveComponent(option) {
		// default to open or return null?
		return cmpMap[option.MimeType];
	}

	renderOption(option, addable) {
		const Cmp = this.resolveComponent(option);

		if (!Cmp) {
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
	};

	launchAddDialog = () => {
		AddEnrollmentOption.show(
			this.props.availableOptions,
			this.props.enrollmentOptions
		).then(selectedType => {
			this.props.store.addEnrollmentOption(selectedType);
		});
	};

	renderAddButton() {
		const { availableOptions } = this.props;

		if (!availableOptions || availableOptions.length === 0) {
			return null;
		}

		return (
			<div className="add enrollment-card" onClick={this.launchAddDialog}>
				<div className="icon">+</div>
				<div className="text">{t('addOption')}</div>
			</div>
		);
	}

	renderOptions() {
		const { enrollmentOptions } = this.props;

		return (
			<div className="options-list">
				{(enrollmentOptions || []).map(this.renderExistingOption)}
				{this.state.editMode && this.renderAddButton()}
			</div>
		);
	}

	enterEditMode = () => {
		this.setState({ editMode: true });
	};

	exitEditMode = () => {
		this.setState({ editMode: false });
	};

	renderCustomizeButton() {
		return (
			<div className="customize-button" onClick={this.enterEditMode}>
				{t('customize')}
			</div>
		);
	}

	renderDoneCustomizingButton() {
		return (
			<div className="customize-button" onClick={this.exitEditMode}>
				{t('doneCustomizing')}
			</div>
		);
	}

	canCustomize() {
		const { availableOptions, enrollmentOptions } = this.props;

		if (availableOptions && availableOptions.length > 0) {
			return true;
		}

		const editableOptions = (enrollmentOptions || []).filter(x =>
			x.hasLink('edit')
		);

		return editableOptions.length > 0;
	}

	renderEmptyState() {
		return <div className="empty-state">{t('emptyText')}</div>;
	}

	toggleOpenEnrollment = () => {
		this.props.store.toggleOpenEnrollment(!this.props.allowOpenEnrollment);
	};

	toggleExternalEnrollment = () => {
		const { availableOptions, enrollmentOptions } = this.props;

		const customExternalOption = (availableOptions || [])
			.concat(enrollmentOptions || [])
			.filter(x =>
				x.MimeType.match(/ensyncimisexternalenrollmentoption/)
			)[0];

		if (!customExternalOption) {
			return;
		}

		if (this.hasExternalEnrollment()) {
			this.props.store.removeOption(customExternalOption);
		} else {
			this.props.store.addEnrollmentOption(customExternalOption);
		}
	};

	allowsExternalEnrollment() {
		const { availableOptions } = this.props;

		if (availableOptions) {
			const filtered = availableOptions.filter(x =>
				x.MimeType.match(/ensyncimisexternalenrollmentoption/)
			);

			return filtered.length > 0;
		}

		return false;
	}

	hasExternalEnrollment() {
		const { enrollmentOptions } = this.props;

		if (enrollmentOptions) {
			const filtered = enrollmentOptions.filter(x =>
				x.MimeType.match(/ensyncimisexternalenrollmentoption/)
			);

			return filtered.length > 0;
		}

		return false;
	}

	render() {
		const { loading, warning /*, availableOptions, enrollmentOptions*/ } =
			this.props;

		if (loading) {
			return <Loading.Ellipsis />;
		}

		// let isEmpty = (!availableOptions || availableOptions.length === 0) && (!enrollmentOptions || enrollmentOptions.length === 0);

		return (
			<div className="enrollment-options">
				{/* <div className="enrollment-options-title"> */}
				{/* <span>{t('enrollmentOptions')}</span> */}
				{warning && <div className="warning">{warning}</div>}
				<div className="enrollment-option">
					<div className="label">{t('allowOpen')}</div>
					<div className="control">
						<Input.Toggle
							value={this.props.allowOpenEnrollment}
							onChange={this.toggleOpenEnrollment}
						/>
					</div>
				</div>
				{(this.allowsExternalEnrollment() ||
					this.hasExternalEnrollment()) && (
					<div className="enrollment-option">
						<div className="label">{t('allowCustomExternal')}</div>
						<div className="control">
							<Input.Toggle
								value={this.hasExternalEnrollment()}
								onChange={this.toggleExternalEnrollment}
							/>
						</div>
					</div>
				)}
				{/* {isEmpty && this.renderEmptyState()}
					{!isEmpty && !this.state.editMode && this.renderCustomizeButton()}
					{!isEmpty && this.state.editMode && this.renderDoneCustomizingButton()} */}
				{/* </div> */}
				{/* {!isEmpty && this.renderOptions()} */}
			</div>
		);
	}
}

export default decorate(EnrollmentOptions, [
	Store.connect({
		enrollmentOptions: 'enrollmentOptions',
		availableOptions: 'availableOptions',
		allowOpenEnrollment: 'allowOpenEnrollment',
		error: 'error',
		warning: 'warning',
		loading: 'loading',
	}),
]);
