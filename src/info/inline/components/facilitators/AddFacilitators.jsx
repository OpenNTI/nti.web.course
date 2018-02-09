import React from 'react';
import PropTypes from 'prop-types';
import { TokenEditor, Avatar, Flyout, Prompt } from 'nti-web-commons';
import { getService } from 'nti-web-client';
import {scoped} from 'nti-lib-locale';
import cx from 'classnames';

import Role from './Role';
import {getAvailableRoles} from './utils';


const t = scoped('course.info.inline.components.facilitators.AddFacilitators', {
	addFacilitators: 'Add Facilitators',
	addUsers: 'Add users',
	cancel: 'Cancel',
	add: 'Add',
	role: 'Role',
	assistant: 'Assistant',
	editor: 'Editor',
	instructor: 'Instructor',
	visible: 'Visible to Learners'
});

const DELIMITER_KEYS = ['Enter', 'Tab', ','];

export default class AddFacilitators extends React.Component {
	static propTypes = {
		courseInstance: PropTypes.object.isRequired,
		facilitatorList: PropTypes.arrayOf(PropTypes.object),
		onDismiss: PropTypes.func,
		onConfirm: PropTypes.func
	}

	attachRoleFlyoutRef = x => this.roleFlyout = x

	constructor (props) {
		super(props);

		const {courseInstance} = props;

		const options = getAvailableRoles(courseInstance);

		this.state = {
			selectedRole: 'instructor',
			isVisible: false,
			options
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
								key: x.Username,
								display: x.alias,
								value: x,
								view: (<Suggestion user={x} showUsername={users.filter(y => y.alias === x.alias).length > 1}/>)
							};
						});
					});
			});
	}

	onChange = (values) => {
		this.setState({values});
	}

	doConfirm (values) {
		const { onConfirm } = this.props;

		// for now, filter down to actual users via suggestions, we'll handle non-user entities later
		onConfirm && onConfirm(values.filter(x => x.value).map(x => {
			return {
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

	addFacilitators = () => {
		const { facilitatorList } = this.props;
		const { values } = this.state;

		let conflicts = [];

		if(!values || values.length === 0) {
			return;
		}

		const filtered = values.filter(u => {
			if(facilitatorList.some(f => f.username === u.value.Username && f.role !== '')) {
				conflicts.push(u.value);

				return false;
			}

			return true;
		});

		if(conflicts.length > 0) {
			let userStr = '<br/><br/>';

			conflicts.forEach(c => {
				userStr += '<div>' + c.alias + '</div>';
			});

			Prompt.areYouSure('These users already exist as facilitators and will not be added: ' + userStr).then(() => {
				this.doConfirm(filtered);
			});
		}
		else {
			this.doConfirm(filtered);
		}
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

	onRoleSelect = (role) => {
		this.setState({selectedRole: role});

		this.roleFlyout && this.roleFlyout.dismiss();
	}

	renderRoleOption = (role) => {
		return <Role role={role} key={role} onClick={this.onRoleSelect}/>;
	}

	renderRoleSelect () {
		const { options } = this.state;

		if(!options || options.length <= 1) {
			return (<div className="role-value">{this.state.options[0] && t(this.state.options[0])}</div>);
		}

		return (<Flyout.Triggered
			className="course-facilitator-role-flyout"
			trigger={this.renderRoleTrigger()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachRoleFlyoutRef}
		>
			<div>
				{options.map(this.renderRoleOption)}
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
					onChange={this.onChange}
					tokenDelimiterKeys={DELIMITER_KEYS}
					onlyAllowSuggestions/>
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
		const confirmCls = cx('confirm', this.state.values && this.state.values.length > 0 ? '' : 'disabled');

		return (
			<div className="controls">
				<div className="buttons">
					<div className="cancel" onClick={this.onClose}>{t('cancel')}</div>
					<div className={confirmCls} onClick={this.addFacilitators}>{t('add')}</div>
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
	user: PropTypes.object.isRequired,
	showUsername: PropTypes.bool
};

function Suggestion ({user, showUsername}) {
	return (
		<div className="user-suggestion">
			<Avatar className="image" entity={user}/>
			<div className="user-info">
				<div className="alias">
					<span>{user.alias}</span>
					{showUsername ? (<span className="user-name">({user.Username})</span>) : null}
				</div>
				<div className="email">{user.email}</div>
			</div>
		</div>
	);
}
