import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';

import WizardItem from '../../editor/wizard/WizardItem';
import ScormImport from '../../editor/panels/scorm-import/WizardPanel';
import ImportConfirmation from '../../editor/panels/importconfirmation/WizardPanel';

import ModeSelect, {UPDATE_KEY} from './ModeSelect';

const t = scoped('course.wizard.CourseWizard', {
	finish: 'Finish',
	chooseMode: 'Pick Mode',
	updateTitle: 'Update Package',
	replaceTitle: 'Replace Package'
});

class PackageWizard extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onCourseModified: PropTypes.func,
		onDismiss: PropTypes.func,
		bundle: PropTypes.obj
	}


	state = {}


	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	}


	onModeSelect = (mode) => {
		this.setState({ mode });
	}


	renderMode () {
		return (
			<Switch.Item
				className="scorm-package-content"
				name="TemplateChooser"
				component={WizardItem}
				wizardCmp={ModeSelect}
				title="Scorm Package"
				stepName={t('chooseMode')}
				onModeSelect={this.onModeSelect}
				onCancel={this.cancel}
				firstTab
			/>
		);
	}


	afterSave () {
		const { onFinish } = this.props;

		onFinish && onFinish(this.state.catalogEntry);
	}


	renderUpload () {
		// TODO: provide the appropriate link to the import panel based on the current mode
		return (
			<Switch.Item
				className="scorm-package-content"
				key="scormUpload"
				name="scormUpload"
				component={WizardItem}
				wizardCmp={ScormImport}
				bundle={this.props.bundle}
				title="Change Package"
				stepName={UPDATE_KEY === this.state.mode ? t('updateTitle') : t('replaceTitle')}
				type={this.state.mode}
				onCancel={this.cancel}
				afterSave={this.afterSave} />
		);
	}


	renderConfirmation () {
		return (
			<Switch.Item
				className="scorm-package-content"
				key="scormUploadConfirmation"
				name="scormUploadConfirmation"
				component={WizardItem}
				wizardCmp={ImportConfirmation}
				catalogEntry={this.props.catalogEntry}
				title="Change Package"
				stepName="Confirmation"
				onCancel={this.cancel}
				afterSave={this.afterSave}
			/>
		);
	}


	render () {
		return (
			<Switch.Panel className="scorm-package" active="TemplateChooser">
				<Switch.Container>
					{this.renderMode()}
					{this.renderUpload()}
					{this.renderConfirmation()}
				</Switch.Container>
			</Switch.Panel>
		);
	}
}

export default PackageWizard;
