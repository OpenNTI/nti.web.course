import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import cx from 'classnames';

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
	enrollmentOptions: 'Enrollment Options',
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

export default class EnrollmentOptions extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);
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

		if(!openEnrollment) {
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
		return (
			<div className="enrollment-options">
				<div className="course-option-label">{t('enrollmentOptions')}</div>
				{this.renderOpenEnrollment()}
				{this.renderStoreEnrollment()}
				{this.renderEnrollmentOption('IMSEnrollment')}
				{this.renderEnrollmentOption('FiveminuteEnrollment')}
			</div>
		);
	}
}
