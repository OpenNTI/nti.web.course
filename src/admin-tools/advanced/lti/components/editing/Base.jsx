import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panels, DialogButtons, Prompt, Select, Input } from 'nti-web-commons';

const { Label } = Input;
const { Dialog } = Prompt;

import Manual from './forms/Manual';
import ByXML from './forms/ByXML';
import ByURL from './forms/ByURL';

const MODES = {
	MANUAL: 'input',
	XML: 'xml_paste',
	URL: 'xml_link'
};

const modeOptions = [
	{ label: 'Manual Entry', value: MODES.MANUAL },
	{ label: 'By URL', value: MODES.URL },
	{ label: 'Paste XML', value: MODES.XML }
];

export default class Base extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		onSubmit: PropTypes.func.isRequired,
		submitLabel: PropTypes.string.isRequired
	}

	static getDerivedStateFromProps (nextProps, prevState) {
		if (nextProps.item) {
			const { item } = nextProps;
			const { title, description, MimeType } = item;

			return {
				item: {
					title,
					description,
					'consumer_key': item['consumer_key'],
					secret: '',
					'launch_url': item['launch_url'],
					'secure_launch_url': item['secure_launch_url'],
					'xml_paste': '',
					'xml_link': '',
					MimeType,
					formselector: MODES.MANUAL
				}
			};
		} else if (!prevState || !prevState.item) {
			return {
				item: {
					formselector: MODES.MANUAL,
					title: '',
					description: '',
					'consumer_key': '',
					secret: '',
					'launch_url': '',
					'secure_launch_url': '',
					'xml_paste': '',
					'xml_link': '',
					'MimeType': 'application/vnd.nextthought.ims.consumer.configuredtool'
				}
			};
		}

		return null;
	}

	onModeSelect = ({ target: { value } }) => {
		const { item } = this.state;
		this.setState({ item: { ...item, formselector: value } });
	}

	onChange = (name, value) => {
		const { item } = this.state;
		this.setState({ item: { ...item, [name]: value } });
	}

	onSubmit = async () => {
		const { item } = this.state;
		const { onSubmit } = this.props;

		onSubmit(item);
	}

	renderForm () {
		const { mode, item } = this.state;
		let Form;

		if (mode === MODES.XML) { Form = ByXML; }
		else if (mode === MODES.URL) { Form = ByURL; }
		else { Form = Manual; }

		return <Form onSubmit={this.onSubmit} onChange={this.onChange} item={item} />;
	}

	render () {
		const { onBeforeDismiss, title, submitLabel = 'Create' } = this.props;
		const { item: { formselector } } = this.state;

		const buttons = [
			{ label: 'Cancel', onClick: onBeforeDismiss },
			{ label: submitLabel, onClick: this.onSubmit }
		];

		return (
			<Dialog closeOnMaskClick onBeforeDismiss={onBeforeDismiss}>
				<div className="lti-base-tool-editing">
					<Panels.TitleBar title={title} iconAction={onBeforeDismiss} />
					<Label className="config-type-label" label="Configuration Type">
						<Select value={formselector} onChange={this.onModeSelect}>
							{modeOptions.map(({ value, label }) => (
								<option key={value} value={value}>{label}</option>
							))}
						</Select>
					</Label>
					{this.renderForm()}
					<DialogButtons className="lti-base-add-controls" buttons={buttons} />
				</div>
			</Dialog>
		);
	}
}