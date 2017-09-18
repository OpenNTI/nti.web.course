import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import { Blank } from '../../templates/Blank';
import { Import } from '../../templates/Import';

const LABELS = {
	cancel: 'Cancel',
	courseName: 'Course Name',
	identifier: 'Identification Number (i.e. UCOL-3224)',
	description: 'Description'
};

const t = scoped('COURSE_WIZARD', LABELS);

export default class TemplateChooser extends React.Component {
	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		onTemplateSelect: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	onSave = (done) => {
		const { onTemplateSelect } = this.props;

		onTemplateSelect && onTemplateSelect(this.state.selected);

		done();
	};

	renderSaveCmp () {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if(Cmp) {
			return (<Cmp onSave={this.onSave} label={buttonLabel}/>);
		}

		return null;
	}

	renderCancelCmp () {
		if(this.props.onCancel) {
			return (<div className="course-panel-cancel" onClick={this.props.onCancel}>{t('cancel')}</div>);
		}
	}

	renderItem (item) {
		const updateSelected = () => {
			this.setState({selected: item});
		};

		const className = 'item' + (item.name === (this.state.selected && this.state.selected.name) ? ' selected' : '');

		return (
			<div className={className} onClick={updateSelected}>
				<div className="template-icon"/>
				<div className="template-name">{item.name}</div>
				<div className="template-description">{item.description}</div>
			</div>
		);
	}

	render () {
		return (<div className="course-panel-templatechooser">
			<div className="course-panel-content">
				<div className="options-container">
					{this.renderItem(Blank)}
					{this.renderItem(Import)}
				</div>
			</div>
			<div className="course-panel-controls">
				{this.renderSaveCmp()}
				{this.renderCancelCmp()}
			</div>
		</div>
		);
	}
}
