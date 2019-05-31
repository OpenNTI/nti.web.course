import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import BaseForm from './BaseForm';

const { Label, Text } = Input;

const ByURL = ({ onSubmit, onChange, item, renderButtons }) => (
	<BaseForm onSubmit={onSubmit} onChange={onChange} item={item} renderButtons={renderButtons}>
		<Label label="Tool Config URL">
			<Text required value={item['xml_link']} onChange={(value) => onChange('xml_link', value)} placeholder="url" />
		</Label>
	</BaseForm>
);

ByURL.propTypes = {
	renderButtons: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		'xml_link': PropTypes.string.isRequired,
	})
};

export default ByURL;
