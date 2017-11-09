import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from 'nti-web-commons';
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

		// for visibility, we'll use the Instructors field of the catalogEntry.  If a facilitator is marked
		// visible, they should appear in the Instructors list for a catalogEntry.  If marked hidden, they should
		// not appear in catalogEntry Instructors list
		//onValueChange && onValueChange('Instructors', this.state.facilitatorList.filter(x => x.visible));

		onValueChange && onValueChange('facilitators', this.state.facilitatorList);
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
