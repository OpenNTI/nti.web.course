import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Avatar} from 'nti-web-commons';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	visible: 'Visible',
	hidden: 'Hidden',
	facilitator: 'Facilitator',
	instructor: 'Instructor'
};

const t = scoped('components.course.editor.inline.components.facilitators.facilitator', LABELS);

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitator: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		onRemove: PropTypes.func,
		editable: PropTypes.bool
	}

	attachTypeFlyoutRef = x => this.typeFlyout = x
	attachVisibilityFlyoutRef = x => this.visibilityFlyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderVisibilityTrigger () {
		const text = this.props.facilitator.visible ? t('visible') : t('hidden');

		return <div className="trigger">{text}<i className="icon-chevron-down"/></div>;
	}

	toggleVisible = () => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			visible: true
		});

		this.visibilityFlyout && this.visibilityFlyout.dismiss();
	}

	toggleHidden = () => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			visible: false
		});

		this.visibilityFlyout && this.visibilityFlyout.dismiss();
	}

	renderVisibilitySelect () {
		return (<Flyout.Triggered
			className="course-facilitator-visibility-flyout"
			trigger={this.renderVisibilityTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachVisibilityFlyoutRef}
		>
			<div>
				<div className="visibility-option" onClick={this.toggleVisible}>{t('visible')}</div>
				<div className="visibility-option" onClick={this.toggleHidden}>{t('hidden')}</div>
			</div>
		</Flyout.Triggered>);
	}

	renderTypeTrigger () {
		const {role} = this.props.facilitator;

		return <div className="trigger">{t(role)}<i className="icon-chevron-down"/></div>;
	}

	renderTypeOption (type) {
		const onClick = () => {
			const {onChange, facilitator} = this.props;

			onChange && onChange({
				...facilitator,
				role: type
			});

			this.typeFlyout && this.typeFlyout.dismiss();
		};

		return (<div className="type-option" onClick={onClick}>{t(type)}</div>);
	}

	renderTypeSelect () {
		return (<Flyout.Triggered
			className="course-facilitator-type-flyout"
			trigger={this.renderTypeTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachTypeFlyoutRef}
		>
			<div>
				{this.renderTypeOption('instructor')}
				{this.renderTypeOption('facilitator')}
			</div>
		</Flyout.Triggered>);
	}

	removeFacilitator = () => {
		const { onRemove } = this.props;

		onRemove && onRemove(this.props.facilitator);
	}

	renderDelete () {
		return (<div className="delete-facilitator" onClick={this.removeFacilitator}><i className="icon-light-x"/></div>);
	}

	renderName () {
		const { facilitator } = this.props;

		return <div className="name">{facilitator.Name}</div>;
	}

	renderControls () {
		const { editable } = this.props;

		if(editable) {
			return (
				<div className="controls">
					<div className="visibility">
						{this.renderVisibilitySelect()}
					</div>
					{this.renderDelete()}
				</div>
			);
		}

		return null;
	}

	renderType () {
		const { editable } = this.props;

		if(editable) {
			return (<div className="type">
				{this.renderTypeSelect()}
			</div>);
		}

		return (<div className="type">Instructor</div>);
	}

	render () {
		const { facilitator, editable } = this.props;

		const className = cx('facilitator', { 'edit': editable });

		return (
			<div className={className}>
				<Avatar className="image" entityId={facilitator.username}/>
				<div className="facilitator-info">
					{this.renderName()}
					{this.renderType()}
					<div className="title">{facilitator.JobTitle}</div>
				</div>
				{this.renderControls()}
			</div>
		);
	}
}
