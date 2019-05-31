import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Avatar, Input, Checkbox} from '@nti/web-commons';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {getService} from '@nti/web-client';

import {default as Role, RoleLabel} from './Role';
import {getAvailableRoles} from './utils';


const t = scoped('course.info.inline.components.facilitators.Facilitator', {
	visible: 'Visible',
	hidden: 'Hidden',
	hiddenInfo: 'Hidden From Learners',
	titlePlaceholder: 'Add a title'
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

	componentDidMount () {
		const { facilitator } = this.props;

		if(facilitator.imageUrl) {
			this.validateImage(this.props);
		}
	}

	componentDidUpdate (prevProps) {
		if(this.props.facilitator.imageUrl !== prevProps.facilitator.imageUrl) {
			this.setState({
				validImage: false
			}, () => {
				this.validateImage(this.props);
			});
		}
	}

	renderVisibilityTrigger () {
		const text = this.props.facilitator.visible ? t('visible') : t('hidden');

		return <div className="trigger">{text}<i className="icon-chevron-down"/></div>;
	}

	onVisibiltyChange = ({target: {checked: hidden}}) => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			visible: !hidden
		});
	}

	renderVisibilitySelect () {
		const {facilitator: {visible}} = this.props;

		return (
			<Checkbox onChange={this.onVisibiltyChange} label={t('hidden')} checked={!visible} />
		);
	}

	renderRoleTrigger () {
		const {role} = this.props.facilitator;

		return <div className="trigger"><RoleLabel role={role} /><i className="icon-chevron-down"/></div>;
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
		return <Role key={role} role={role} onClick={this.onRoleSelect} />;
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
		return (<div className="delete-facilitator" onClick={this.removeFacilitator}><i className="icon-bold-x"/></div>);
	}

	renderControls () {
		const { editable } = this.props;

		return !editable ? null : (
			<div className="controls">
				{this.renderRole()}
				<div className="visibility">
					{this.renderVisibilitySelect()}
				</div>
				{this.renderDelete()}
			</div>
		);
	}

	canEdit () {
		const { courseInstance } = this.props;

		return courseInstance && courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors');
	}

	renderRole () {
		const { editable, courseInstance, facilitator, adminView } = this.props;

		const options = getAvailableRoles(courseInstance);

		// only allow selecting roles if they're editable and there is more than one
		// option available to choose
		if(editable && options && options.length > 1) {
			return (
				<div className="role">
					{this.renderRoleSelect(options)}
				</div>
			);
		}

		if (editable || adminView) {
			return (<div className="role">{facilitator.role && t(facilitator.role)}</div>);
		}

		// if not editable, don't show role
		return null;
	}

	renderImage () {
		const { facilitator } = this.props;
		const className = 'image';

		if(facilitator.imageUrl && this.state.validImage) {
			const style = {
				backgroundImage: 'url(' + facilitator.imageUrl + ')'
			};

			return (
				<div className={className} style={style}/>
			);
		}

		return <Avatar className={className} entity={facilitator.username}/>;
	}

	onTitleChange = (e) => {
		const {onChange, facilitator} = this.props;

		onChange && onChange({
			...facilitator,
			JobTitle: e
		});
	}

	renderTitle () {
		const { facilitator: {JobTitle}, editable } = this.props;

		return editable
			? <Input.Text className="job-title-input" onChange={this.onTitleChange} value={JobTitle} placeholder={t('titlePlaceholder')}/>
			: <span>{JobTitle}</span>;
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

	renderVisibilityStatus () {
		return (
			<div className="visibility-status">
				<div className="status"><i className="icon-hide"/> {t('hidden')}</div>
				<div className="visibility-info">{t('hiddenInfo')}</div>
			</div>
		);
	}

	render () {
		const { editable, facilitator: {Name, visible} } = this.props;

		const className = cx('facilitator', { 'edit': editable, hidden: !visible });

		return (
			<div className={className}>
				{this.renderImage()}
				{!visible && !editable && this.renderVisibilityStatus()}
				<div className="name">{Name}</div>
				<div className="title">{this.renderTitle()}</div>
				{editable && this.renderControls()}
			</div>
		);
	}
}
