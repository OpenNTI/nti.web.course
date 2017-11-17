import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Avatar} from 'nti-web-commons';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {getService, getAppUsername} from 'nti-web-client';

import {getAvailableRoles} from './utils';

const LABELS = {
	visible: 'Visible',
	hidden: 'Hidden',
	editor: 'Editor',
	instructor: 'Instructor',
	assistant: 'Assistant'
};

const t = scoped('components.course.editor.inline.components.facilitators.facilitator', LABELS);

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitator: PropTypes.object.isRequired,
		courseInstance: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		onRemove: PropTypes.func,
		editable: PropTypes.bool,
		adminView: PropTypes.bool
	}

	attachTypeFlyoutRef = x => this.typeFlyout = x
	attachVisibilityFlyoutRef = x => this.visibilityFlyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	validateImage (props) {
		const { facilitator } = props;

		if(facilitator.imageUrl) {
			getService().then(service => {
				service.get(facilitator.imageUrl).then(() => {
					this.setState({validImage: true});
				}).catch(() => {
					this.setState({validImage: false});
				});
			});
		}
	}

	isMe () {
		return getAppUsername() === this.props.facilitator.username;
	}

	componentDidMount () {
		const { facilitator } = this.props;

		if(facilitator.imageUrl) {
			this.validateImage(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if(this.props.facilitator !== nextProps.facilitator) {
			this.setState({
				validImage: false
			}, () => {
				this.validateImage(nextProps);
			});
		}
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

	renderTypeOption = (type) => {
		const onClick = () => {
			const {onChange, facilitator} = this.props;

			onChange && onChange({
				...facilitator,
				role: type
			});

			this.typeFlyout && this.typeFlyout.dismiss();
		};

		return (<div key={type} className="type-option" onClick={onClick}>{t(type)}</div>);
	}

	renderTypeSelect (options) {
		return (<Flyout.Triggered
			className="course-facilitator-type-flyout"
			trigger={this.renderTypeTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachTypeFlyoutRef}
		>
			<div>
				{options.map(this.renderTypeOption)}
			</div>
		</Flyout.Triggered>);
	}

	removeFacilitator = () => {
		const { onRemove } = this.props;

		onRemove && onRemove(this.props.facilitator);
	}

	renderDelete () {
		if(this.isMe()) {
			return null;
		}

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

	canEdit () {
		const { courseInstance } = this.props;

		return courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors');
	}

	renderType () {
		const { editable, courseInstance, facilitator, adminView } = this.props;

		const options = getAvailableRoles(courseInstance);

		// only allow selecting roles if there editable and there is more than one
		// option available to choose
		if(!this.isMe() && editable && options && options.length > 1) {
			return (<div className="type">
				{this.renderTypeSelect(options)}
			</div>);
		}

		if(editable || adminView) {
			return (<div className="type">{facilitator.role && t(facilitator.role)}</div>);
		}

		// if not editable, don't show role
		return null;
	}

	renderImage () {
		const { facilitator } = this.props;

		if(facilitator.imageUrl && this.state.validImage) {
			const style = {
				backgroundImage: 'url(' + facilitator.imageUrl + ')'
			};

			return (
				<div className="image" style={style}/>
			);
		}

		return <Avatar className="image" entityId={facilitator.username}/>;
	}

	render () {
		const { facilitator, editable } = this.props;

		const className = cx('facilitator', { 'edit': editable });

		return (
			<div className={className}>
				{this.renderImage()}
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
