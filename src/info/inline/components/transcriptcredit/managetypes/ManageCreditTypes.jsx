import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, Input} from '@nti/web-commons';

import AddButton from '../../../widgets/AddButton';

import Store from './CreditTypesStore';
import CreditType from './CreditType';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.ManageCreditTypes', {
	addNewType: 'Add New Type',
	type: 'Type',
	unit: 'Unit'
});

export default
@Store.connect({
	loading: 'loading',
	types: 'types'
})
class ManageCreditTypes extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		types: PropTypes.arrayOf(PropTypes.object),
		store: PropTypes.object,
		onValuesUpdated: PropTypes.func
	}


	state = {}


	componentDidMount () {
		const {store} = this.props;

		if(store) {
			store.loadAllTypes();
		}
	}


	componentDidUpdate (oldProps) {
		if(oldProps.types !== this.props.types) {
			this.setState({
				types: this.props.types
			});
		}
	}

	updateValues = () => {
		const {onValuesUpdated} = this.props;

		if(onValuesUpdated) {
			onValuesUpdated(this.state.types);
		}
	}

	onEntryChange = (updatedEntry) => {
		const newTypes = this.state.types.map(x => {
			if(this.getEffectiveId(x) === this.getEffectiveId(updatedEntry)) {
				return updatedEntry;
			}

			return x;
		});

		this.setState({types: newTypes}, this.updateValues);
	}

	addEntry = () => {
		const newTypes = [...this.state.types];

		newTypes.push({
			addID: this.findNewID(),
			type: '',
			unit: '',
			disabled: false
		});

		this.setState({types: newTypes}, this.updateValues);
	}

	onEntryRemove = (removedEntry) => {
		const newTypes = this.state.types.filter(x => this.getEffectiveId(x) !== this.getEffectiveId(removedEntry));

		this.setState({types: newTypes}, this.updateValues);
	}


	renderType = (type) => {
		return <CreditType key={this.getEffectiveId(type)} type={type} onChange={this.onEntryChange} onRemove={this.onEntryRemove}/>;
	}


	getEffectiveId (entry) {
		return entry.NTIID || entry.addID;
	}

	findNewID () {
		const existingIDs = this.state.types
			.filter(x => x.addID)
			.map(x => parseInt(x.addID, 10))
			.sort();

		let newID = existingIDs.length === 0 ? 1 : existingIDs[existingIDs.length - 1] + 1;
		return newID.toString();
	}

	renderAddEditor () {
		return (
			<div className="add-editor">
				<Input.Text/>
				<Input.Text/>
			</div>
		);
	}

	renderTypesEditor () {
		const {types} = this.state;

		if(!types) {
			return null;
		}

		return (
			<div className="all-types">
				<div className="header">
					<span className="header-text">{t('type')}</span>
					<span className="header-text">{t('unit')}</span>
				</div>
				{types.map(this.renderType)}
				<div className="add-type">
					{this.state.addMode ? this.renderAddEditor() : <AddButton label={t('addNewType')} clickHandler={this.addEntry}/>}
				</div>
			</div>
		);
	}

	render () {
		const {error} = this.state;
		const {loading} = this.props;

		return (
			<div className="manage-credit-types">
				{error && <div className="error">{error}</div>}
				{loading ? <Loading.Ellipsis/> : this.renderTypesEditor()}
			</div>
		);
	}
}
