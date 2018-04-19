import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import BaseForm from './BaseForm';

const { Label, TextArea } = Input;

const ByXML = ({ onChange, onSubmit, item }) => (
	<BaseForm onChange={onChange} onSubmit={onSubmit} item={item} >
		<Label label="Paste XML">
			<TextArea value={item['xml_paste']} onChange={(value) => onChange('xml_paste', value)} />
		</Label>
	</BaseForm>
);

ByXML.propTypes = {
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		'xml_paste': PropTypes.string.isRequired,
	})
};

export default ByXML;
