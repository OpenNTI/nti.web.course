import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Facilitator from './Facilitator';
import AddFacilitators from './AddFacilitators';


const t = scoped('course.info.inline.components.facilitators.Edit', {
	addFacilitators: 'Add a Facilitator',
	assistant: 'Assistant',
	editor: 'Editor',
	instructor: 'Instructor'
});

const DEFAULT_JOB_TITLES = ['Assistant', 'Instructor', 'Editor'];

export default class FacilitatorsEdit extends React.Component {
	static propTypes = {
		courseInstance: PropTypes.object.isRequired,
		facilitators: PropTypes.arrayOf(PropTypes.object),
		onValueChange: PropTypes.func
	}

	// no static FIELD_NAME, facilitators come from a couple different sources

	constructor (props) {
		super(props);

		this.state = {
			facilitatorList: props.facilitators.map(x => {
				return {
					...x,
					key: x.username
				};
			})
		};
	}

	canEdit () {
		const { courseInstance } = this.props;

		return courseInstance && courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors');
	}

	renderFacilitator = (facilitator) => {
		const canEdit = this.canEdit();

		return (
			<Facilitator
				key={facilitator.username + facilitator.Name}
				facilitator={facilitator}
				courseInstance={this.props.courseInstance}
				onChange={this.updateFacilitator}
				onRemove={this.removeFacilitator}
				editable={!facilitator.locked && canEdit}/>
		);
	}

	updateFacilitatorList = (users) => {
		const { facilitatorList } = this.state;

		let replacedUsers = [];

		const transformed = users.map(u => {
			// check if there is an existing facilitator for this username
			// a scenario where this could happen is the user was 'removed' (flagged for removal so still in the list)
			// but re-added via the AddFacilitators dialog.  In that case, we want to just replace the existing facilitator
			// with the re-added user
			const existingFacilitator = facilitatorList.filter(f => f.username === u.username);

			const user = existingFacilitator[0] || u;

			if(existingFacilitator[0]) {
				// track users we are replacing
				replacedUsers.push(existingFacilitator[0].username);
			}

			let newUser = {
				...user,
				visible: u.visible,
				role: u.role
			};

			if(DEFAULT_JOB_TITLES.includes(newUser.JobTitle)) {
				// we assigned a default job title, meaning we didn't have one initially, so just reflect
				// the role
				newUser.JobTitle = t(newUser.role);
			}

			return newUser;
		});

		this.setState({
			// remove replaced users, which will now come from the transformed list
			facilitatorList: [...(facilitatorList.filter(x => !replacedUsers.includes(x.username))), ...transformed]
		}, () => {
			this.updateValues();
		});
	}

	updateFacilitator = (facilitator) => {
		this.replaceFacilitator(facilitator);
	}

	launchAddDialog = () => {
		Prompt.modal(<AddFacilitators onConfirm={this.updateFacilitatorList} courseInstance={this.props.courseInstance} facilitatorList={this.state.facilitatorList}/>);
	}

	renderAddFacilitator () {
		return (
			<div className="add-facilitator" onClick={this.launchAddDialog}>
				<div className="add-icon">
					<i className="icon-add"/>
				</div>
				<div className="add-label">{t('addFacilitators')}</div>
			</div>
		);
	}

	updateValues () {
		const { onValueChange } = this.props;

		onValueChange && onValueChange('facilitators', this.state.facilitatorList);
	}

	removeFacilitator = (facilitator) => {
		const { key } = facilitator;

		this.setState({
			facilitatorList: this.state.facilitatorList.map(x => {
				if(x.key === key) {
					return {...x, role: ''};
				}

				return x;
			})
		}, () => {
			this.updateValues();
		});
	}

	replaceFacilitator (facilitator) {
		const { key } = facilitator;

		this.setState({
			facilitatorList: this.state.facilitatorList.map(x => {
				if(x.key === key) {
					let newUser = {...facilitator};

					if(DEFAULT_JOB_TITLES.includes(newUser.JobTitle)) {
						// we assigned a default job title, meaning we didn't have one initially, so just reflect
						// the role
						newUser.JobTitle = t(newUser.role);
					}

					return newUser;
				}

				return x;
			})
		}, () => {
			this.updateValues();
		});
	}

	render () {
		return (
			<div>
				<div className="facilitators-header">
					<div className="field-label">Facilitators</div>
					{this.renderAddFacilitator()}
				</div>
				<div className="facilitators">
					{(this.state.facilitatorList || []).filter(x => x.role && x.role !== '').map(this.renderFacilitator)}
				</div>
			</div>
		);
	}
}
