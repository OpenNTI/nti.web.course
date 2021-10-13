import './Base.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

import {
	Error,
	Panels,
	DialogButtons,
	Select,
	Input,
	Loading,
	Prompt,
} from '@nti/web-commons';

const { Label } = Input;

const { Dialog } = Prompt;

import Manual from './forms/Manual';
import ByXML from './forms/ByXML';
import ByURL from './forms/ByURL';

const MODES = {
	MANUAL: 'input',
	XML: 'xml_paste',
	URL: 'xml_link',
};

const modeOptions = [
	{ label: 'Manual Entry', value: MODES.MANUAL },
	{ label: 'By URL', value: MODES.URL },
	{ label: 'Paste XML', value: MODES.XML },
];

export default class Base extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		onSubmit: PropTypes.func.isRequired,
		submitLabel: PropTypes.string.isRequired,
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
		loading: PropTypes.bool,
		item: PropTypes.object,
		modal: PropTypes.bool,
	};

	static defaultProps = {
		modal: false,
		submitLabel: 'Create',
	};

	constructor(props) {
		super(props);
		const item = this._setupItem(props);
		this.state = { item };
	}

	componentDidMount() {
		const item = this._setupItem(this.props);
		this.setState({ item });
	}

	_setupItem(props) {
		const { item } = props;
		if (item) {
			const { title, description, MimeType } = item;

			return {
				title,
				description,
				consumer_key: item['consumer_key'],
				secret: '',
				launch_url: item['launch_url'],
				secure_launch_url: item['secure_launch_url'],
				xml_paste: '',
				xml_link: '',
				MimeType,
				formselector: MODES.MANUAL,
			};
		}

		return {
			formselector: MODES.MANUAL,
			title: '',
			description: '',
			consumer_key: '',
			secret: '',
			launch_url: '',
			secure_launch_url: '',
			xml_paste: '',
			xml_link: '',
			MimeType: 'application/vnd.nextthought.ims.consumer.configuredtool',
		};
	}

	onModeSelect = ({ target: { value } }) => {
		const { item } = this.state;
		this.setState({ item: { ...item, formselector: value } });
	};

	onChange = (name, value) => {
		const { item } = this.state;
		this.setState({ item: { ...item, [name]: value } });
	};

	onSubmit = e => {
		const { item } = this.state;
		const { onSubmit } = this.props;
		e.preventDefault();

		onSubmit(item);
	};

	onBeforeDismiss = () => {
		const { onBeforeDismiss } = this.props;
		onBeforeDismiss();
	};

	renderForm() {
		const { item } = this.state;
		const { submitLabel, loading, error } = this.props;

		const { formselector } = item;
		let Form = Manual;

		if (formselector === MODES.XML) {
			Form = ByXML;
		} else if (formselector === MODES.URL) {
			Form = ByURL;
		}

		const buttons = [
			{ label: 'Cancel', onClick: this.onBeforeDismiss },
			{
				label: submitLabel,
				type: 'submit',
				disabled: loading,
				tag: 'button',
			},
		];

		let errors = null;
		if (error && error instanceof Array) {
			errors = error.reduce((obj, x) => {
				obj[x.field] = x.message;
				return obj;
			}, {});
		}

		return (
			<Form
				onSubmit={this.onSubmit}
				onChange={this.onChange}
				item={item}
				renderButtons={
					<DialogButtons
						className="lti-base-add-controls"
						buttons={buttons}
					/>
				}
				error={errors}
			/>
		);
	}

	render() {
		const { title, error, loading, modal } = this.props;
		const {
			item: { formselector },
		} = this.state;

		const contents = (
			<div className="lti-base-tool-editing">
				<Panels.TitleBar
					title={title}
					iconAction={this.onBeforeDismiss}
				/>
				{error && typeof error === 'string' && (
					<Error inline error={error} className="lti-base-tool-error">
						{error}
					</Error>
				)}
				<Label className="config-type-label" label="Configuration Type">
					<Select value={formselector} onChange={this.onModeSelect}>
						{modeOptions.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Select>
				</Label>
				{this.renderForm()}
				{loading && <Loading.Mask maskScreen message="Loading..." />}
			</div>
		);

		return modal ? (
			contents
		) : (
			<Dialog closeOnMaskClick onBeforeDismiss={this.onBeforeDismiss}>
				{contents}
			</Dialog>
		);
	}
}
