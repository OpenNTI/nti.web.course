import './WizardPanel.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DayPickerRange } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { saveCatalogEntry } from '../../../editor/Actions';

const t = scoped('course.editor.panels.dates.WizardPanel', {
	cancel: 'Cancel',
	finish: 'Finish',
});

export default class DatePickerWizardPanel extends React.Component {
	static tabName = 'CourseDatesPicker';
	static tabDescription = 'Choose Course Dates';

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		catalogEntry: PropTypes.object,
		afterSave: PropTypes.func,
		buttonLabel: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedType: 'Start',
			startDate:
				this.props.catalogEntry &&
				this.props.catalogEntry.StartDate &&
				new Date(props.catalogEntry.StartDate),
			endDate:
				this.props.catalogEntry &&
				this.props.catalogEntry.EndDate &&
				new Date(props.catalogEntry.EndDate),
		};
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

	onSave = done => {
		const { afterSave, catalogEntry } = this.props;

		saveCatalogEntry(
			catalogEntry,
			{
				ProviderUniqueID: catalogEntry.ProviderUniqueID,
				StartDate: this.state.startDate,
				EndDate: this.state.endDate,
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
			return <Cmp onSave={this.onSave} label={buttonLabel} />;
		}

		return null;
	}

	updateStartDate = newDate => {
		this.setState({ startDate: newDate });
	};

	updateEndDate = newDate => {
		this.setState({ endDate: newDate });
	};

	render() {
		return (
			<div className="course-panel-choosedates">
				<div className="course-panel-content">
					<DayPickerRange
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						updateStartDate={this.updateStartDate}
						updateEndDate={this.updateEndDate}
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
