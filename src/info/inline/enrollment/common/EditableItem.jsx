import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, DialogButtons} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

const t = scoped('course.info.inline.enrollment.common.EditableItem', {
	areYouSure: 'Do you want to remove this enrollment option from the course?',
	cancel: 'Cancel',
	save: 'Save',
	ok: 'OK'
});

export default class EditableItem extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		className: PropTypes.string,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func,
		onRemove: PropTypes.func,
		onSave: PropTypes.func,
		error: PropTypes.string,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		inEditMode: PropTypes.bool,
		isDisabled: PropTypes.bool,
		children: PropTypes.object
	}

	state = {}

	renderIcon () {
		return <div className="item-icon"/>;
	}

	renderInfo () {
		return (
			<div className="item-info">
				<div className="name">{this.props.title}</div>
				<div className="description">{this.props.description}</div>
			</div>
		);
	}

	onRemove = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {isDisabled} = this.props;

		if(isDisabled) {
			return;
		}

		Prompt.areYouSure(t('areYouSure')).then(() => {
			const {onRemove, option} = this.props;

			if(onRemove) {
				onRemove(option);
			}
		});
	}

	renderControl () {
		if(this.props.addable) {
			return <div className="item-control">Add</div>;
		}
		else if(this.props.editable) {
			return <div className="item-control" onClick={this.onRemove}>Remove</div>;
		}
	}

	onItemClick = () => {
		const {onItemActivate, isDisabled} = this.props;

		if(onItemActivate && !isDisabled) {
			onItemActivate();
		}
	}

	onSave = () => {
		const {onSave} = this.props;

		if(onSave) {
			onSave();
		}
	}

	onCancel = () => {
		const {onItemDeactivate} = this.props;

		if(onItemDeactivate) {
			onItemDeactivate();
		}
	}

	renderButtons () {
		const {editable, addable} = this.props;

		let buttons = [];

		if(editable || addable) {
			buttons.push({
				className: 'cancel',
				label: t('cancel'),
				onClick: this.onCancel
			});

			buttons.push({
				className: 'confirm',
				label: t('save'),
				onClick: this.onSave
			});
		}
		else {
			buttons.push({
				className: 'confirm',
				label: t('ok'),
				onClick: this.onCancel
			});
		}

		return <DialogButtons buttons={buttons}/>;
	}

	render () {
		const {children, addable, inEditMode, isDisabled, error, className} = this.props;

		const cls = cx('editable-item', className, {addable, editing: inEditMode, disabled: isDisabled});

		return (
			<div className={cls}>
				<div className="item-summary" onClick={this.onItemClick}>
					{this.renderIcon()}
					{this.renderInfo()}
					{!inEditMode && this.renderControl()}
				</div>
				<div className="editable-content">
					{inEditMode && children}
					{inEditMode && error && <div className="error">{error}</div>}
				</div>
				{inEditMode && this.renderButtons()}
			</div>
		);
	}
}
