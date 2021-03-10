import React from 'react';
import PropTypes from 'prop-types';

import { Input } from '@nti/web-commons';

import BaseForm from './BaseForm';

const { Label, TextArea } = Input;

const ByXML = ({ onChange, onSubmit, item, renderButtons, error }) => (
	<BaseForm
		onChange={onChange}
		onSubmit={onSubmit}
		item={item}
		renderButtons={renderButtons}
	>
		<Label label="Paste XML">
			<TextArea
				required
				value={item['xml_paste']}
				onChange={value => onChange('xml_paste', value)}
			/>
		</Label>
		{error && error.xml_paste && (
			<span className="lti-base-form-error">{error.xml_paste}</span>
		)}
	</BaseForm>
);

ByXML.propTypes = {
	renderButtons: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		xml_paste: PropTypes.string.isRequired,
	}),
	error: PropTypes.object,
};

export default ByXML;
