import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Prompt, Loading, Presentation } from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {getService} from '@nti/web-client';

import Store from '../Store';
import { Edit } from '../templates/Edit';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

import PanelItem from './PanelItem';


const t = scoped('course.editor.tab.CourseEditor', {
	finish: 'Finish',
	saving: 'Saving...',
	save: 'Save',
});

export default class CourseEditor extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func
	}

	static showEditor (catalogEntry, onCancel, onSave) {
		let props = {
			catalogEntry
		};

		if(onCancel) {
			props.onCancel = onCancel;
		}

		if(onSave) {
			props.onSave = onSave;
		}

		return Prompt.modal(<CourseEditor {...props}/>,
			'course-panel-wizard');
	}

	constructor (props) {
		super(props);

		this.state = {};

		const catalogEntry = props.catalogEntry;

		getService().then((service) => {
			return service.getObject(catalogEntry.CourseNTIID).then((courseInstance) => {
				this.setState({courseInstance});
			});
		});
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = (data) => {
		if (data.type === COURSE_SAVING) {
			this.setState({loading: true});
		} else if (data.type === COURSE_SAVE_ERROR) {
			this.setState({loading: false, errorMsg: data.errorMsg});
		} else if (data.type === COURSE_SAVED) {
			this.setState({loading: false, hasSaved: true});
		}
	}

	cancel = () => {
		const { hasSaved } = this.state;
		const { onCancel, onFinish, catalogEntry } = this.props;

		hasSaved && onFinish && onFinish(catalogEntry);

		onCancel && onCancel();
	};

	renderLoadingMask () {
		if(this.state.loading) {
			return (<Loading.Mask message={t('saving')}/>);
		}

		return null;
	}

	renderCloseButton () {
		return (<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>);
	}

	renderTrigger = (panel) => {
		const tabPanel = panel.TabPanel;

		return (<Switch.Trigger key={tabPanel.tabName} className="course-editor-menu-item" item={tabPanel.tabName}>{tabPanel.tabDescription}</Switch.Trigger>);
	}

	renderTriggers () {
		return Edit.panels.map(this.renderTrigger);
	}

	renderPanel = (panel) => {
		const tabPanel = panel.TabPanel;

		return (
			<Switch.Item
				className="course-panel-content"
				key={tabPanel.tabName}
				name={tabPanel.tabName}
				component={PanelItem}
				panelCmp={tabPanel}
				catalogEntry={this.props.catalogEntry}
				courseInstance={this.state.courseInstance}
				onCancel={this.cancel}
				afterSave={this.props.onSave}
				saveCmp={SaveButton}/>
		);
	}

	renderItems () {
		return Edit.panels.map(this.renderPanel);
	}

	render () {
		const { catalogEntry } = this.props;

		return (
			<div className="course-editor">
				{this.renderLoadingMask()}
				{this.renderCloseButton()}
				<Switch.Panel className="course-panel editor" active={Edit.panels[0].TabPanel.tabName}>
					<Switch.Controls className="course-editor-menu">
						<Presentation.AssetBackground className="course-image" contentPackage={catalogEntry} type="landing"/>
						<div className="course-id">{catalogEntry.ProviderUniqueID}</div>
						<div className="course-title">{catalogEntry.title}</div>
						{this.renderTriggers()}
					</Switch.Controls>
					<Switch.Container>
						{this.renderItems()}
					</Switch.Container>
				</Switch.Panel>
			</div>
		);
	}
}

SaveButton.propTypes = {
	onSave: PropTypes.func,
	label: PropTypes.string
};

function SaveButton ({onSave, label}) {
	return (
		<div onClick={onSave} className="course-panel-continue">{label || t('save')}</div>
	);
}
