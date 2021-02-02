import './PackageWizard.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import WizardItem from '../../editor/wizard/WizardItem';
import ScormImport from '../../editor/panels/scorm-import/WizardPanel';
import ImportConfirmation from '../../editor/panels/importconfirmation/WizardPanel';

import ModeSelect, {UPDATE_KEY, REPLACE_KEY} from './ModeSelect';

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
		bundle: PropTypes.shape({
			Metadata: PropTypes.shape({
				getLink: PropTypes.func.isRequired,
				hasLink: PropTypes.func.isRequired
			}),
			getID: PropTypes.func.isRequired
		}).isRequired
	}

	/**
	 * Constructor
	 * @param {Object} props - contains bundle
	 */
	constructor (props) {
		super(props);

		this.state = {};

		const { bundle } = props;

		/**
		 * @property {boolean} hasScormPackage - checks for the presence of LauchScorm Link
		 */
		this.hasScormPackage = bundle.Metadata && !!bundle.Metadata.getLink('LaunchSCORM');

		if (!this.hasScormPackage) {
			this.state.mode = REPLACE_KEY;
		}
	}


	componentDidUpdate ({bundle}) {
		const {bundle: nextBundle} = this.props;

		if (bundle.getID() !== nextBundle.getID()) {
			this.hasScormPackage = nextBundle.Metadata && nextBundle.Metadata.getLink('LaunchSCORM');

			if (!this.hasScormPackage) {
				this.setState({ mode: REPLACE_KEY });
			} else {
				this.setState({ mode: null });
			}
		}
	}

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


	afterSave = (newBundle) => {
		const { onFinish } = this.props;

		onFinish && onFinish(newBundle);
	}


	renderUpload () {
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
				onFinish={this.afterSave}
				afterSave={this.afterSave}
				firstTab={!this.hasScormPackage}
			/>
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

	/**
	 * Render
	 * @returns {JSX} - Renders the switch chooser
	 * @description Mode Chooser is hidden for courses with no content package. This is driven of of hasScormPackage property.
	 */
	render () {
		const active = !this.hasScormPackage ? 'scormUpload' : 'TemplateChooser';

		return (
			<Switch.Panel className="scorm-package" active={active}>
				<Switch.Container>
					{this.hasScormPackage && this.renderMode()}
					{this.renderUpload()}
					{this.renderConfirmation()}
				</Switch.Container>
			</Switch.Panel>
		);
	}
}

export default PackageWizard;
