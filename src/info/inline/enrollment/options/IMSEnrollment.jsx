import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Store from '../EnrollmentOptionsStore';
import EditableItem from '../common/EditableItem';
import FieldView from '../common/FieldView';

const t = scoped('course.info.inline.enrollment.options.IMSEnrollment', {
	title: 'IMS',
	description: 'IMS Enrollment',
	scopedID: 'Scoped ID'
});

export default class IMSEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func
	}

	state = {}

	componentDidMount () {
		const {option} = this.props;

		this.store = Store.getInstance();

		this.setState({url: option.enrollmentURL});
	}

	onSave = async () => {
		// not supported yet
	}

	onRemove = async () => {
		// not supported yet
	}

	onItemActivate = () => {
		const { onItemActivate, option } = this.props;

		if(onItemActivate) {
			onItemActivate(option.MimeType);
		}
	}

	onItemDeactivate = () => {
		const { onItemDeactivate, option } = this.props;

		if(onItemDeactivate) {
			onItemDeactivate(option.MimeType);
		}

		// reset error/value to defaults
		this.setState({error: null, url: this.props.option.enrollmentURL});
	}

	renderContent () {
		// const {editable} = this.props;
		//
		// if(!editable) {
		const sourcedID = this.props.option.SourcedID;

		return (
			<div className="field-container">
				<FieldView label={t('scopedID')} value={sourcedID}/>
			</div>
		);
		// }
		//
		// return (
		// 	<div className="field-input-container">
		// 		<div className="field-input">
		// 			<div className="field-label">Amount</div>
		// 			<Input.Text value="Free" onChange={this.onURLChange}/>
		// 		</div>
		// 	</div>
		// );
	}

	render () {
		const newProps = {...this.props};

		delete newProps.onItemActivate;
		delete newProps.onItemDeactivate;

		return (
			<EditableItem
				title={t('title')}
				description={t('description')}
				className="ims"
				onItemActivate={this.onItemActivate}
				onItemDeactivate={this.onItemDeactivate}
				onSave={this.onSave}
				onRemove={this.onRemove}
				error={this.state.error}
				{...newProps}
			>
				{this.renderContent()}
			</EditableItem>
		);
	}
}
