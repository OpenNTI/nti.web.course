import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nti-web-commons';

const { Label, Text } = Input;

const BaseForm = ({ item, onChange, children, onSubmit }) => (
	<form className="lti-base-form" onSubmit={onSubmit}>
		<div className="split-input">
			<Label label="Consumer Key">
				<Text value={item['consumer_key']} onChange={value => onChange('consumer_key', value)} className="lti-tool-'consumer_key'" placeholder="Consumer Key" />
			</Label>
			<Label label="Shared Secret">
				<Text value={item.secret} onChange={value => onChange('secret', value)} className="lti-tool-Scret" placeholder="Secret" type="password" />
			</Label>
		</div>
		{children}
	</form>
);

BaseForm.propTypes = {
	children: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	item: PropTypes.shape({
		'consumer_key': PropTypes.string.isRequired,
		secret: PropTypes.string.isRequired
	}).isRequired,
	onSubmit: PropTypes.func.isRequired
};

export default BaseForm;
