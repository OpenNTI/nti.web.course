import React from 'react';
import PropTypes from 'prop-types';
import { TokenEditor, Avatar, Flyout } from 'nti-web-commons';
import { getService } from 'nti-web-client';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	addFacilitators: 'Add Facilitators',
	addUsers: 'Add users',
	cancel: 'Cancel',
	add: 'Add',
	role: 'Role',
	assistant: 'Assistant',
	editor: 'Editor',
	instructor: 'Instructor',
	visible: 'Visible to Learners'
};

const t = scoped('components.course.editor.inline.components.facilitators.addfacilitators', LABELS);

export default class AddFacilitators extends React.Component {
	static propTypes = {
		onDismiss: PropTypes.func,
		onConfirm: PropTypes.func
	}

	attachRoleFlyoutRef = x => this.roleFlyout = x

	constructor (props) {
		super(props);

		this.state = {
			selectedRole: 'instructor',
			isVisible: false
		};
	}

	onClose = () => {
		this.props.onDismiss();
	}

	onMessageChange = (value) => {
		this.setState({message: value});
	}

	suggestionProvider = (value) => {
		return getService()
			.then(s => s.getContacts())
			.then((contacts) => {
				return contacts.search(value, false, true)
					.then((results) => {
						const users = results.filter(entity => entity.isUser );

						return users.map(x => {
							return {
								display: x.alias,
								value: x,
								view: (<Suggestion user={x}/>)
							};
						});
					});
			});
	}

	onChange = (values) => {
		this.setState({values});
	}

	addFacilitators = () => {
		const { onConfirm } = this.props;

		// for now, filter down to actual users via suggestions, we'll handle non-user entities later
		onConfirm && onConfirm(this.state.values.filter(x => x.value).map(x => {
			return {
				...x.value,
				visible: this.state.isVisible,
				role: this.state.selectedRole,
				key: x.value.Username,
				// mimic an Instructor object for the server-side with these fields
				Name: x.value.alias,
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo',
				username: x.value.Username,
				JobTitle: t(this.state.selectedRole)
			};
		}));

		this.onClose();
	}

	renderHeader () {
		return (
			<div className="header">
				<div className="label">{t('addFacilitators')}</div>
				<div className="close" onClick={this.onClose}><i className="icon-light-x"/></div>
			</div>
		);
	}

	renderRoleTrigger () {
		return (
			<div className="trigger">
				<div className="role-value">{t(this.state.selectedRole)}</div>
				<div className="dropdown"><i className="icon-chevron-down"/></div>
			</div>
		);
	}

	renderRoleOption (role) {
		const onClick = () => {
			this.setState({selectedRole: role});

			this.roleFlyout && this.roleFlyout.dismiss();
		};

		const text = t(role);

		return (<div className="role-option" onClick={onClick}>{text}</div>);
	}

	renderRoleSelect () {
		return (<Flyout.Triggered
			className="course-facilitator-role-flyout"
			trigger={this.renderRoleTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachRoleFlyoutRef}
		>
			<div>
				{this.renderRoleOption('instructor')}
				{this.renderRoleOption('editor')}
				{this.renderRoleOption('assistant')}
			</div>
		</Flyout.Triggered>);
	}

	onVisibilityChanged = (e) => {
		this.setState({isVisible: e.target.checked});
	}

	renderBody () {
		return (
			<div className="input">
				<TokenEditor
					value={this.state.values}
					placeholder={t('addUsers')}
					suggestionProvider={this.suggestionProvider}
					onChange={this.onChange}/>
				<div className="role">
					<div className="field-label">{t('role')}</div>
					<div className="role-select">{this.renderRoleSelect()}</div>
				</div>
				<div className="visibility">
					<input type="checkbox" checked={this.state.isVisible} onChange={this.onVisibilityChanged}/>
					<span>{t('visible')}</span>
				</div>
			</div>
		);
	}

	renderControls () {
		return (
			<div className="controls">
				<div className="buttons">
					<div className="cancel" onClick={this.onClose}>{t('cancel')}</div>
					<div className="confirm" onClick={this.addFacilitators}>{t('add')}</div>
				</div>
			</div>
		);
	}

	render () {
		return (
			<div className="add-facilitators">
				{this.renderHeader()}
				{this.renderBody()}
				{this.renderControls()}
			</div>
		);
	}
}

Suggestion.propTypes = {
	user: PropTypes.object.isRequired
};

function Suggestion ({user}) {
	return (
		<div className="user-suggestion">
			<Avatar className="image" entity={user}/>
			<div className="user-info">
				<div className="alias">{user.alias}</div>
				<div className="email">{user.email}</div>
			</div>
		</div>
	);
}
