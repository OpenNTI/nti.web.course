import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Avatar} from '@nti/web-commons';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {getService, getAppUsername} from '@nti/web-client';

import Role from './Role';
import {getAvailableRoles} from './utils';


const t = scoped('course.info.inline.components.facilitators.Facilitator', {
	visible: 'Visible',
	hidden: 'Hidden',
	editor: 'Editor',
	instructor: 'Instructor',
	assistant: 'Assistant'
});

export default class Facilitator extends React.Component {
	static propTypes = {
		facilitator: PropTypes.object.isRequired,
		courseInstance: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		onRemove: PropTypes.func,
		editable: PropTypes.bool,
		adminView: PropTypes.bool
	}

	attachRoleFlyoutRef = x => this.roleFlyout = x
	attachVisibilityFlyoutRef = x => this.visibilityFlyout = x

	constructor (props) {
		super(props);

		this.state = {
			JobTitle: props.facilitator.JobTitle,
			Biography: props.facilitator.Biography
		};
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
		if(this.props.facilitator.imageUrl !== nextProps.facilitator.imageUrl) {
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
		return (
			<Flyout.Triggered
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
			</Flyout.Triggered>
		);
	}

	renderRoleTrigger () {
		const {role} = this.props.facilitator;

		return <div className="trigger">{t(role)}<i className="icon-chevron-down"/></div>;
	}

	onRoleSelect = (role) => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			role
		});

		this.roleFlyout && this.roleFlyout.dismiss();
	};

	renderRoleOption = (role) => {
		return <Role key={role} role={role} onClick={this.onRoleSelect}/>;
	}

	renderRoleSelect (options) {
		return (
			<Flyout.Triggered
				className="course-facilitator-role-flyout"
				trigger={this.renderRoleTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachRoleFlyoutRef}
			>
				<div>
					{options.map(this.renderRoleOption)}
				</div>
			</Flyout.Triggered>
		);
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

		return courseInstance && courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors');
	}

	renderRole () {
		const { editable, courseInstance, facilitator, adminView } = this.props;

		const options = getAvailableRoles(courseInstance);

		// only allow selecting roles if there editable and there is more than one
		// option available to choose
		if(!this.isMe() && editable && options && options.length > 1) {
			return (
				<div className="role">
					{this.renderRoleSelect(options)}
				</div>
			);
		}

		if(editable || adminView) {
			return (<div className="role">{facilitator.role && t(facilitator.role)}</div>);
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

		return <Avatar className="image" entity={facilitator.username}/>;
	}

	onTitleChange = (e) => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			JobTitle: e
		});
	}

	renderTitle () {
		const { facilitator } = this.props;

		// if(facilitator.visible && editable) {
		// 	return (
		// 		<div className="title">
		// 			<div className="label">Title</div>
		// 			<Input.Text className="job-title-input" onChange={this.onTitleChange} value={facilitator.JobTitle}/>
		// 		</div>
		// 	);
		// }

		return (<div className="title">{facilitator.JobTitle}</div>);
	}

	// Are we going to support suffix editing/displaying?
	// onSuffixChange = (e) => {
	// 	const {onChange, facilitator} = this.props;
	//
	// 	onChange && onChange({
	// 		...facilitator,
	// 		Suffix: e
	// 	});
	// }
	//
	// renderSuffix () {
	// 	const { facilitator, editable } = this.props;
	//
	// 	if(facilitator.visible && editable) {
	// 		return (
	// 			<div className="suffix">
	// 				<div className="label">Suffix</div>
	// 				<Input.Text className="suffix-input" onChange={this.onSuffixChange} value={facilitator.Suffix}/>
	// 			</div>
	// 		);
	// 	}
	//
	// 	return null;
	// }

	// Are we going to support biography editing/displaying?
	// onBioChange = (e) => {
	// 	const {onChange, facilitator} = this.props;
	//
	// 	onChange && onChange({
	// 		...facilitator,
	// 		Biography: e
	// 	});
	// }
	//
	//
	// renderBio () {
	// 	const { facilitator, editable } = this.props;
	//
	// 	if(facilitator.visible && editable) {
	// 		return (
	// 			<div className="bio">
	// 				<div className="label">Bio</div>
	// 				<Input.TextArea className="bio-input" onChange={this.onBioChange} value={facilitator.Biography}/>
	// 			</div>
	// 		);
	// 	}
	//
	// 	return null;
	// }

	render () {
		const { editable } = this.props;

		const className = cx('facilitator', { 'edit': editable });

		return (
			<div className={className}>
				{this.renderImage()}
				<div className="facilitator-info">
					{this.renderName()}
					{this.renderRole()}
					{this.renderTitle()}
				</div>
				{this.renderControls()}
			</div>
		);
	}
}
