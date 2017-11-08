import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from 'nti-web-commons';
import {getService} from 'nti-web-client';
import {scoped} from 'nti-lib-locale';

import Facilitator from './Facilitator';
import AddFacilitators from './AddFacilitators';

const LABELS = {
	addFacilitators: 'Add a Facilitator'
};

const t = scoped('components.course.editor.inline.components.facilitators.edit', LABELS);

export default class FacilitatorsEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		courseInstance: PropTypes.object.isRequired,
		facilitators: PropTypes.arrayOf(PropTypes.object),
		setSaveCallback: PropTypes.func,
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

	renderFacilitator = (facilitator) => {
		return (
			<Facilitator
				key={facilitator.username}
				facilitator={facilitator}
				onChange={this.updateFacilitator}
				onRemove={this.removeFacilitator}
				editable/>
		);
	}

	updateFacilitatorList = (users) => {
		const transformed = users.map(u => {
			return {
				...u,
				visible: u.visible,
				role: u.role
			};
		});

		this.setState({
			facilitatorList: [...this.state.facilitatorList, ...transformed]
		}, () => {
			this.updateValues();
		});
	}

	updateFacilitator = (facilitator) => {
		this.replaceFacilitator(facilitator);
	}

	launchAddDialog = () => {
		Prompt.modal(<AddFacilitators onConfirm={this.updateFacilitatorList}/>);
	}

	renderAddFacilitator () {
		return (
			<div className="add-facilitator">
				<div className="add-icon">
					<i className="icon-add"/>
				</div>
				<div className="add-label" onClick={this.launchAddDialog}>{t('addFacilitators')}</div>
			</div>
		);
	}

	saveInstructorData = () => {
		// set the appropriate roles
		const { courseInstance } = this.props;
		const { facilitatorList } = this.state;

		if(courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors')) {
			return getService().then(service => {
				// sort the facilitator list into instructors and editors to save (there can be overlap in those lists)
				//
				// assistant => Instructors
				// editor => Editors
				// instructor => Instructors + Editors

				const instructorsLink = courseInstance.getLink('Instructors');
				const editorsLink = courseInstance.getLink('Editors');

				const editorsToSave = (facilitatorList || []).filter(x => x.role === 'editor' || x.role === 'instructor');
				const instructorsToSave = (facilitatorList || []).filter(x => x.role === 'assistant' || x.role === 'instructor');

				const editorsToRemove = (facilitatorList || []).filter(x => x.role !== 'editor' && x.role !== 'instructor');
				const instructorsToRemove = (facilitatorList || []).filter(x => x.role !== 'assistant' && x.role !== 'instructor');

				instructorsToSave.forEach(x => {
					service.post(instructorsLink, {
						user: x.username
					});
				});

				instructorsToRemove.forEach(x => {
					service.delete(instructorsLink + '/' + x.username);
				});

				editorsToSave.forEach(x => {
					service.post(editorsLink, {
						user: x.username
					});
				});

				editorsToRemove.forEach(x => {
					service.delete(editorsLink + '/' + x.username);
				});
			});
		}

		return Promise.resolve();
	}

	updateValues () {
		const { onValueChange, setSaveCallback } = this.props;

		// for visibility, we'll use the Instructors field of the catalogEntry.  If a facilitator is marked
		// visible, they should appear in the Instructors list for a catalogEntry.  If marked hidden, they should
		// not appear in catalogEntry Instructors list
		onValueChange && onValueChange('Instructors', this.state.facilitatorList.filter(x => x.visible));

		// since data has changed, we should set the callback so it gets invoked on editor save
		setSaveCallback && setSaveCallback(this.saveInstructorData);
	}

	removeFacilitator = (facilitator) => {
		const { key } = facilitator;

		this.setState({
			facilitatorList: this.state.facilitatorList.filter(x => x.key !== key)
		}, () => {
			this.updateValues();
		});
	}

	replaceFacilitator (facilitator) {
		const { key } = facilitator;

		this.setState({
			facilitatorList: this.state.facilitatorList.map(x => x.key === key ? facilitator : x)
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
					{(this.state.facilitatorList || []).map(this.renderFacilitator)}
				</div>
			</div>
		);
	}
}
