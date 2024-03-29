import './WizardPanel.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Input } from '@nti/web-commons';

import { saveCatalogEntry } from '../../../editor/Actions';

const t = scoped('course.editor.panels.basic.WizardPanel', {
	cancel: 'Cancel',
	create: 'Create Course',
	courseName: 'Course Name',
	identifier: 'Identification Number (i.e. UCOL-3224)',
	description: 'Description',
});

export default class BasicWizardPanel extends React.Component {
	static tabName = 'CourseBasic';
	static tabDescription = 'Get Started';

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		onSave: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			courseName: props.catalogEntry && props.catalogEntry.title,
			identifier:
				props.catalogEntry && props.catalogEntry.ProviderUniqueID,
			description: props.catalogEntry && props.catalogEntry.description,
		};
	}

	onSave = done => {
		const { catalogEntry, afterSave, onSave } = this.props;

		if (onSave) {
			onSave({ done, ...this.state });
			return;
		}

		saveCatalogEntry(
			catalogEntry,
			{
				ProviderUniqueID: this.state.identifier,
				title: this.state.courseName,
				identifier: this.state.identifier,
				RichDescription: this.state.description,
			},
			() => {
				afterSave && afterSave();

				done && done();
			}
		);
	};

	renderSaveCmp() {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if (Cmp) {
			return (
				<Cmp onSave={this.onSave} label={buttonLabel || t('create')} />
			);
		}

		return null;
	}

	renderCancelCmp() {
		if (this.props.onCancel) {
			return (
				<div
					className="course-panel-cancel"
					onClick={this.props.onCancel}
				>
					{t('cancel')}
				</div>
			);
		}
	}

	updateCourseName = value => {
		this.setState({ courseName: value });
	};

	updateIDNumber = value => {
		this.setState({ identifier: value });
	};

	updateDescription = value => {
		this.setState({ description: value });
	};

	render() {
		return (
			<div className="course-panel-getstarted-form">
				<div className="course-panel-content">
					<Input.Text
						placeholder={t('courseName')}
						value={this.state.courseName}
						onChange={this.updateCourseName}
						maxLength="140"
					/>
					<Input.Text
						placeholder={t('identifier')}
						value={this.state.identifier}
						onChange={this.updateIDNumber}
						maxLength="32"
					/>
					<Input.TextArea
						placeholder={t('description')}
						inputClassName="nti-text-input"
						value={this.state.description}
						onChange={this.updateDescription}
					/>
				</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}
