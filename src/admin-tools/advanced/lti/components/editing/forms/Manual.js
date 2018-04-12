import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nti-web-commons';

import BaseForm from './BaseForm';

const { Label, Text } = Input;

const Manual = ({ onChange, onSubmit, item }) => (
	<BaseForm onChange={onChange} onSubmit={onSubmit} item={item}>
		<Label label="Title">
			<Text value={item.title} onChange={value => onChange('title', value)} placeholder="Title" />
		</Label>
		<Label label="Description">
			<Text value={item.description} onChange={value => onChange('description', value)} placeholder="Description" />
		</Label>
		<div className="split-input">
			<Label label="Launch URL">
				<Text value={item['launch_url']} onChange={(value) => onChange('launch_url', value)} placeholder="Launch URL" />
			</Label>
			<Label label="Secure Launch URL">
				<Text value={item['secure_launch_url']} onChange={(value) => onChange('secure_launch_url', value)} placeholder="Secure Launch URL" />
			</Label>
		</div>
	</BaseForm>
);

Manual.propTypes = {
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		'launch_url': PropTypes.string.isRequired,
		'secure_launch_url': PropTypes.string.isRequired
	}).isRequired
};

export default Manual;
