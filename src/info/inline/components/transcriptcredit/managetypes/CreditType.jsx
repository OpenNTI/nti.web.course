import './CreditType.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Input, Prompt } from '@nti/web-commons';

export default class CreditType extends React.Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		type: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		onRemove: PropTypes.func,
		onEnterEditMode: PropTypes.func,
		onExitEditMode: PropTypes.func,
		onNewEntryCancel: PropTypes.func,
		disabled: PropTypes.bool,
		inEditMode: PropTypes.bool,
	};

	state = {};

	constructor() {
		super();
	}

	componentDidMount() {
		this.setState({ definition: this.props.type });
	}

	typesAreDifferent(typeA, typeB) {
		const { unit: oldUnit, type: oldType } = typeA || {};
		const { unit: newUnit, type: newType } = typeB || {};

		return oldUnit !== newUnit || oldType !== newType;
	}

	componentDidUpdate(oldProps) {
		if (this.typesAreDifferent(oldProps.type, this.props.type)) {
			this.setState({ definition: this.props.type });
		}
	}

	onTypeChange = val => {
		this.setState({ definition: { ...this.state.definition, type: val } });
	};

	onUnitChange = val => {
		this.setState({ definition: { ...this.state.definition, unit: val } });
	};

	onRemove = () => {
		const { onRemove, type } = this.props;

		Prompt.areYouSure('Do you want to remove this credit definition?').then(
			() => {
				if (onRemove) {
					onRemove(type);
				}
			}
		);
	};

	enterEdit = () => {
		const { onEnterEditMode, type } = this.props;

		if (onEnterEditMode) {
			onEnterEditMode(type);
		}
	};

	onCancel = () => {
		const { type } = this.props;
		const { onNewEntryCancel } = this.props;

		this.setState({ definition: type });

		this.exitEdit();

		if (type.addedRow && onNewEntryCancel) {
			onNewEntryCancel();
		}
	};

	exitEdit = () => {
		const { onExitEditMode, type } = this.props;

		if (onExitEditMode) {
			onExitEditMode(type);
		}
	};

	onConfirm = async () => {
		const { store } = this.props;
		const { definition } = this.state;

		if (
			definition.addedRow ||
			this.typesAreDifferent(this.props.type, definition)
		) {
			await store.saveValues([definition]);

			const error = store.getError();

			if (error) {
				this.setState({ error });
				return;
			}

			await store.loadAllTypes();
		}

		this.exitEdit();
	};

	renderEditable(cls) {
		const { definition, error } = this.state;

		if (!definition) {
			return null;
		}

		return (
			<div className={cls}>
				{error && <div className="error">{error}</div>}
				<Input.Text
					className="type"
					value={definition.type}
					onChange={this.onTypeChange}
				/>
				<Input.Text
					className="unit"
					value={definition.unit}
					onChange={this.onUnitChange}
				/>
				<div className="confirm" onClick={this.onConfirm}>
					OK
				</div>
				<div className="cancel" onClick={this.onCancel}>
					Cancel
				</div>
			</div>
		);
	}

	renderViewable(cls) {
		const { disabled } = this.props;
		const { definition } = this.state;

		if (!definition) {
			return null;
		}

		return (
			<div className={cls}>
				<div className="credit-value">{definition.type}</div>
				<div className="credit-value">{definition.unit}</div>
				{!disabled && (
					<i className="icon-edit" onClick={this.enterEdit} />
				)}
				{!disabled && !disabled && (
					<i className="icon-remove" onClick={this.onRemove} />
				)}
			</div>
		);
	}

	render() {
		const { disabled, inEditMode } = this.props;

		const cls = cx('credit-type', { disabled, edit: inEditMode });

		return inEditMode ? this.renderEditable(cls) : this.renderViewable(cls);
	}
}
