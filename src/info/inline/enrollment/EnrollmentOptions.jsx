import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';
import cx from 'classnames';

import Store from './EnrollmentOptionsStore';
import {CustomExternalEnrollment, ExternalEnrollment, IMSEnrollment, OpenEnrollment, StoreEnrollment} from './options';
import EnrollmentCard from './common/EnrollmentCard';

const FIELDS = {
	OpenEnrollment: [

	],
	IMSEnrollment: [
		'SourcedID'
	],
	StoreEnrollment: [

	],
	FiveminuteEnrollment: [
		'Price', 'CRN', 'Term'
	]
};

const t = scoped('course.components.EnrollmentOptions', {
	enrollmentOptions: 'Enrollment',
	OpenEnrollment: 'Open',
	IMSEnrollment: 'IMS',
	StoreEnrollment: 'Purchase',
	FiveminuteEnrollment: 'Five-Minute',
	yes: 'Yes',
	no: 'No',
	enabled: 'Enabled',
	available: 'Available',
	enrolled: 'Enrolled',
	SourcedID: 'Sourced ID',
	Price: 'Cost',
	CRN: 'CRN',
	Term: 'Term',
	Amount: 'Cost',
	alsoFree: 'This class is also available for free'
});

const DISPLAY_MAPPING = {
	'true': t('yes'),
	'false': t('no')
};

function getDisplayFor (value) {
	return DISPLAY_MAPPING[value] || value;
}

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
		if(/ensyncimisexternalenrollmentoption/.test(option.MimeType)) {
			return CustomExternalEnrollment;
		}

		if(/externalenrollmentoption/.test(option.MimeType)) {
			return ExternalEnrollment;
		}

		if(/storeenrollmentoption/.test(option.MimeType)) {
			return StoreEnrollment;
		}

		if(/ozoneenrollmentoption/.test(option.MimeType)) {
			return IMSEnrollment;
		}

		if(/openenrollmentoption/.test(option.MimeType)) {
			return OpenEnrollment;
		}

		// default to open or return null?
	}

	onItemActivate = (mimeType) => {
		this.setState({activeItem: mimeType});
	}

	onItemDeactivate = (mimeType) => {
		this.setState({activeItem: null});
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
				onItemActivate={this.onItemActivate}
				onItemDeactivate={this.onItemDeactivate}
				inEditMode={this.state.activeItem === option.MimeType}
				isDisabled={this.state.activeItem && this.state.activeItem !== option.MimeType}
				editable={option.hasLink('edit')}
				addable={addable}
			/>
		);
	}

	renderExistingOption = (option, addable) => {
		return this.renderOption(option, false);
	}

	renderAddableOption = (option) => {
		return this.renderOption(option, true);
	}

	renderOptions () {
		const {availableOptions, enrollmentOptions} = this.props;

		return (
			<div className="options-list">
				{(enrollmentOptions || []).map(this.renderExistingOption)}
				{/* {(availableOptions || []).map(this.renderAddableOption)} */}
			</div>
		);
	}

	getOption (optionName) {
		const options = this.props.catalogEntry.getEnrollmentOptions();

		return ((options && options.Items) || {})[optionName];
	}

	renderValue = (keyValuePair) => {
		const { label, value } = keyValuePair;

		if(value) {
			return (
				<div key={label} className="option-field">
					<div className="label">{t(label)}</div>
					<div className="value">{getDisplayFor(value)}</div>
				</div>
			);
		}
	}

	renderEnrollmentOption (optionName) {
		const option = this.getOption(optionName);

		if(option) {
			const className = cx('enrollment-option', optionName.toLowerCase());

			const keyValuePairs = (FIELDS[optionName] || [])
				.map(f => {
					return {
						label: f,
						value: option[f] !== undefined && option[f].toString()
					};
				});

			return (
				<div className={className}>
					<div className="title">{t(optionName)}</div>
					<div className="values">
						{keyValuePairs.map(this.renderValue)}
					</div>
				</div>
			);
		}
	}

	renderPurchasableInfo (option) {
		const { Purchasables } = option;

		if(Purchasables && Purchasables.Items && Purchasables.Items.length > 0) {
			const purchasable = Purchasables.Items[0];

			return (
				<div className="option-field">
					<div className="label">{t('Amount')}</div>
					<div className="value">{getDisplayFor(purchasable.Amount)}</div>
				</div>
			);
		}
	}

	renderOpenEnrollment () {
		const openEnrollment = this.getOption('OpenEnrollment');

		if(!openEnrollment || !openEnrollment.enabled) {
			return null;
		}

		const className = cx('enrollment-option', 'open-enrollment');

		const keyValuePairs = [
			{
				label: 'Amount',
				value: 'Free'
			}
		];

		return (
			<div className={className}>
				<div className="title">{t('OpenEnrollment')}</div>
				<div className="values">
					{keyValuePairs.map(this.renderValue)}
				</div>
			</div>
		);

	}

	renderStoreEnrollment () {
		const storeEnrollment = this.getOption('StoreEnrollment');

		if(!storeEnrollment) {
			return null;
		}

		const { Purchasables } = (storeEnrollment || {});

		let amount = 0;

		if(Purchasables && Purchasables.Items && Purchasables.Items.length > 0) {
			amount = Purchasables.Items[0].Amount;
		}

		const className = cx('enrollment-option', 'store-enrollment');

		const keyValuePairs = [
			{
				label: 'Amount',
				value:amount
			}
		];

		return (
			<div className={className}>
				<div className="title">{t('StoreEnrollment')}</div>
				<div className="values">
					{keyValuePairs.map(this.renderValue)}
				</div>
			</div>
		);
	}

	render () {
		const {loading} = this.props;

		if(loading) {
			return <Loading.Ellipsis/>;
		}

		return (
			<div className="enrollment-options">
				<div className="enrollment-options-title">{t('enrollmentOptions')}</div>
				{this.renderOptions()}
			</div>
		);
	}
}
