import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';
import { Switch, Loading } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import { Blank } from '../templates/Blank';
import { Import } from '../templates/Import';
import { Scorm } from '../templates/Scorm';

import TemplateChooser from './TemplateChooser';
import WizardItem from './WizardItem';


const t = scoped('course.wizard.CourseWizard', {
	finish: 'Finish',
	chooseTemplate: 'Choose creation type'
});

export default class CourseWizard extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onCourseModified: PropTypes.func
	}

	constructor (props) {
		super(props);

		const save = (data) => {
			return getService().then((service) => {
				return Models.courses.CatalogEntry.getFactory(service).create({...data, key: data.identifier}).then((createdEntry) => {
					this.setState({catalogEntry: createdEntry});
					return createdEntry;
				});
			});
		};

		let catalogEntry = this.props.catalogEntry
			? this.props.catalogEntry
			: {
				save: save,
				delete: () => { return Promise.resolve(); }
			};

		this.state = {
			catalogEntry,
			loadingTemplates: true
		};
	}

	async componentDidMount () {
		const service = await getService();
		const courseWorkspace = service.getWorkspace('Courses');
		const allCoursesCollection = courseWorkspace && service.getCollection('AllCourses', courseWorkspace.Title);

		let availableTemplates = [Blank, Import];

		if (allCoursesCollection && allCoursesCollection.accepts.includes(Models.courses.scorm.SCORMInstance.MimeType)) {
			availableTemplates.push(Scorm);
		}

		this.setState({ availableTemplates, loadingTemplates: false });
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	}

	creationCompleted = (allowRedirect, entry) => {
		const { onFinish } = this.props;

		onFinish && onFinish(entry || this.state.catalogEntry);
	}

	renderItem = (panel, index, arr) => {
		const stepName = 'step' + (index + 2);

		return (<Switch.Item
			className="course-panel-content"
			key={stepName}
			name={stepName}
			component={WizardItem}
			wizardCmp={panel.WizardPanel}
			catalogEntry={this.state.catalogEntry}
			stepName={panel.tabDescription}
			onCancel={this.cancel}
			onFinish={this.creationCompleted}
			hideHeaderControls={panel.WizardPanel.hideHeaderControls}
			afterSave={index === arr.length - 1
				? () => this.creationCompleted(!panel.WizardPanel.disallowEditorRedirect)
				: () => {}}/>);
	}


	renderItems () {
		if(this.state.panels) {
			return (this.state.panels).map(this.renderItem);
		}

		// return a placeholder if we haven't chosen a template yet
		return (<Switch.Item
			className="course-panel-content"
			name="step2"
			component={WizardItem}
			wizardCmp={TemplateChooser}/>);
	}

	onTemplateSelect = (selected) => {
		this.setState({panels : selected.panels});
	}

	renderTemplateChooser () {
		return (<Switch.Item
			className="course-panel-content"
			name="TemplateChooser"
			component={WizardItem}
			wizardCmp={TemplateChooser}
			availableTemplates={this.state.availableTemplates}
			stepName={t('chooseTemplate')}
			onTemplateSelect={this.onTemplateSelect}
			onCancel={this.cancel}
			firstTab />);
	}

	render () {
		if(this.state.loadingTemplates) {
			return <div className="course-panel wizard"><div className="course-wizard-item"><Loading.Mask/></div></div>;
		}

		return (<Switch.Panel className="course-panel wizard" active="TemplateChooser">
			<Switch.Container>
				{this.renderTemplateChooser()}
				{this.renderItems()}
			</Switch.Container>
		</Switch.Panel>);
	}
}
