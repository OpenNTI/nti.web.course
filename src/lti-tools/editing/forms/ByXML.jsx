import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import BaseForm from './BaseForm';

const { Label, TextArea } = Input;

const ByXML = ({ onChange, onSubmit, item, renderButtons }) => (
	<BaseForm onChange={onChange} onSubmit={onSubmit} item={item} renderButtons={renderButtons}>
		<Label label="Paste XML">
			<TextArea required value={item['xml_paste']} onChange={(value) => onChange('xml_paste', value)} />
		</Label>
	</BaseForm>
);

ByXML.propTypes = {
	renderButtons: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		'xml_paste': PropTypes.string.isRequired,
	})
};

export default ByXML;
