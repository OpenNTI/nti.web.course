import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panels, DialogButtons, Prompt, Select, Input, Loading } from '@nti/web-commons';

const { Label } = Input;
const { Dialog } = Prompt;

import Store from '../../Store';

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

const propMap = {
	'editing-error': 'error',
};

export default
@Store.connect(propMap)
class Base extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		onSubmit: PropTypes.func.isRequired,
		submitLabel: PropTypes.string.isRequired,
		error: PropTypes.string,
		store: PropTypes.object,
		loading: PropTypes.bool
	}

	constructor (props) {
		super(props);
		const item = this._setupItem(props);
		this.state = { item };
	}

	componentDidMount () {
		const item = this._setupItem(this.props);
		this.setState({ item });
	}

	_setupItem (props) {
		const { item } = props;
		if (item) {
			const { title, description, MimeType } = item;

			return {
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
			};
		}

		return {
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
		};
	}

	onModeSelect = ({ target: { value } }) => {
		const { item } = this.state;
		this.setState({ item: { ...item, formselector: value } });
	}

	onChange = (name, value) => {
		const { item } = this.state;
		this.setState({ item: { ...item, [name]: value } });
	}

	onSubmit = (e) => {
		const { item } = this.state;
		const { onSubmit } = this.props;
		e.preventDefault();

		onSubmit(item);
	}

	onBeforeDismiss = () => {
		const { store, onBeforeDismiss } = this.props;
		store.clearError();
		onBeforeDismiss();
	}

	renderForm () {
		const { item } = this.state;
		const { submitLabel = 'Create', loading } = this.props;

		const { formselector } = item;
		let Form = Manual;

		if (formselector === MODES.XML) { Form = ByXML; }
		else if (formselector === MODES.URL) { Form = ByURL; }

		const buttons = [
			{ label: 'Cancel', onClick: this.onBeforeDismiss },
			{ label: submitLabel, type: 'submit', disabled: loading, tag: 'button' }
		];

		return (
			<Form
				onSubmit={this.onSubmit}
				onChange={this.onChange}
				item={item}
				renderButtons={
					<DialogButtons className="lti-base-add-controls" buttons={buttons} />
				}
			/>
		);
	}


	render () {
		const { title, error, loading } = this.props;
		const { item: { formselector } } = this.state;

		return (
			<Dialog closeOnMaskClick onBeforeDismiss={this.onBeforeDismiss}>
				<div className="lti-base-tool-editing">
					<Panels.TitleBar title={title} iconAction={this.onBeforeDismiss} />
					{error && <span className="lti-base-tool-error">{error}</span>}
					<Label className="config-type-label" label="Configuration Type">
						<Select value={formselector} onChange={this.onModeSelect}>
							{modeOptions.map(({ value, label }) => (
								<option key={value} value={value}>{label}</option>
							))}
						</Select>
					</Label>
					{this.renderForm()}
					{loading && <Loading.Mask maskScreen message="Loading..." />}
				</div>
			</Dialog>
		);
	}
}
