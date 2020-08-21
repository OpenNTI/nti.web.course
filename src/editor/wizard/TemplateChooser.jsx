import './TemplateChooser.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Template from './Template';


const t = scoped('course.wizard.TemplateChooser', {
	cancel: 'Cancel',
	courseName: 'Course Name',
	identifier: 'Identification Number (i.e. UCOL-3224)',
	description: 'Description'
});

export default class TemplateChooser extends React.Component {
	static propTypes = {
		availableTemplates: PropTypes.arrayOf(PropTypes.object),
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

	updateSelected = (template) => {
		this.setState({selected: template});
	}

	renderItem = (item, index) => {
		return (<Template key={item.name} template={item} onClick={this.updateSelected} selected={item.name === (this.state.selected && this.state.selected.name)}/>);
	}

	render () {
		const { availableTemplates } = this.props;

		return (
			<div className="course-panel-templatechooser">
				<div className="course-panel-content">
					<div className="options-container">
						{(availableTemplates || []).map(this.renderItem)}
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
