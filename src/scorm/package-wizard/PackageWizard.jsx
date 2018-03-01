import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';
import { Switch } from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';

import { Blank } from '../templates/Blank';
import { Import } from '../templates/Import';

import TemplateChooser from './TemplateChooser';
import WizardItem from './WizardItem';
import Scorm from '../../scorm/View';


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

	state = {
		availableTemplates: [Update, Replace]
	};

	async componentDidMount() {
		const service = await getService();
		const courseWorkspace = service.getWorkspace('Courses');
		const allCoursesCollection = courseWorkspace && service.getCollection('AllCourses', courseWorkspace.Title);
		if (allCoursesCollection.accepts[Models.courses.scorm]) {
			this.setState({ availableTemplates: [...this.state.availableTemplates, Scorm] });
		}
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	}

	creationCompleted = (allowRedirect) => {
		const { onFinish } = this.props;

		onFinish && onFinish(this.state.catalogEntry);
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
			hideHeaderControls={panel.WizardPanel.hideHeaderControls}
			afterSave={index === arr.length - 1
				? () => this.creationCompleted(!panel.WizardPanel.disallowEditorRedirect)
				: () => { }} />);
	}


	renderItems() {
		if (this.state.panels) {
			return (this.state.panels).map(this.renderItem);
		}

		// return a placeholder if we haven't chosen a template yet
		return (<Switch.Item
			className="course-panel-content"
			name="step2"
			component={WizardItem}
			wizardCmp={TemplateChooser} />);
	}

	onModeSelect = (mode) => {
		this.setState({ mode });
	}

	renderMode() {
		return (
			<Switch.Item
				className="course-panel-content"
				name="TemplateChooser"
				component={WizardItem}
				wizardCmp={ModeSelect}
				stepName={t('chooseMode')}
				onModeSelect={this.onModeSelect}
				onCancel={this.cancel}
				firstTab 
			/>
		);
	}

	render() {
		return (<Switch.Panel className="course-panel" active="TemplateChooser">
			<Switch.Container>
				{this.renderMode()}
				{this.renderItems()}
			</Switch.Container>
		</Switch.Panel>);
	}
}
