import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Avatar} from 'nti-web-commons';
import cx from 'classnames';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitator: PropTypes.object.isRequired,
		editable: PropTypes.bool
	}

	attachTypeFlyoutRef = x => this.typeFlyout = x
	attachVisibilityFlyoutRef = x => this.visibilityFlyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderVisibilityTrigger () {
		return <div className="trigger">Visible<i className="icon-chevron-down"/></div>;
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
				<div className="visibility-option">Visible</div>
				<div className="visibility-option">Hidden</div>
			</div>
		</Flyout.Triggered>);
	}

	renderTypeTrigger () {
		return <div className="trigger">Instructor<i className="icon-chevron-down"/></div>;
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
				<div className="type-option">Instructor</div>
				<div className="type-option">Assistant</div>
			</div>
		</Flyout.Triggered>);
	}

	renderDelete () {
		return (<div className="delete-facilitator"><i className="icon-light-x"/></div>);
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
