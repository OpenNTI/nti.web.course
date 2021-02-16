import './ModeSelect.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

// TODO: Update the labels to match design
// Also, need to style based on design
const t = scoped('course.scorm.package-wizard.ModeSelect', {
	cancel: 'Cancel',
	updateTitle: 'Update Package',
	updateDescription:
		'Learner progress will be kept, but it will adjust if content was added or removed.',
	updateHint: 'Better for Small Changes',
	replaceTitle: 'Replace Package',
	replaceDescription:
		'Replacing a course package will reset learner progress. All progress will be lost.',
	replaceHint: 'Better for Larger Changes',
});

// TODO: Match the update key to match the server API.  Replace key should already
// be fine since ImportSCORM is the link for uploading a new Scorm package
export const UPDATE_KEY = 'UpdateSCORM';
export const REPLACE_KEY = 'ImportSCORM';

export default class ModeSelect extends React.Component {
	static propTypes = {
		onModeSelect: PropTypes.func.isRequired,
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		buttonLabel: PropTypes.string,
	};

	state = {};

	renderModeOption(name, description, hint, selected, clickHandler) {
		const className = cx('mode-option', { selected });

		return (
			<div className={className} onClick={clickHandler}>
				<div className="name">{name}</div>
				<div className="description">{description}</div>
				<div className="hint">{hint}</div>
			</div>
		);
	}

	onSave = done => {
		const { onModeSelect } = this.props;

		onModeSelect && onModeSelect(this.state.selected);

		done();
	};

	renderSaveCmp() {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if (Cmp) {
			return <Cmp onSave={this.onSave} label={buttonLabel} />;
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

	updateSelected = template => {
		this.setState({ selected: template });
	};

	selectUpdate = () => {
		this.setState({ selected: UPDATE_KEY });
	};

	selectReplace = () => {
		this.setState({ selected: REPLACE_KEY });
	};

	render() {
		const { selected } = this.state;

		return (
			<div className="course-panel-templatechooser">
				<div className="course-panel-content">
					<div className="mode-options-container">
						{this.renderModeOption(
							t('updateTitle'),
							t('updateDescription'),
							t('updateHint'),
							UPDATE_KEY === selected,
							this.selectUpdate
						)}
						{this.renderModeOption(
							t('replaceTitle'),
							t('replaceDescription'),
							t('replaceHint'),
							REPLACE_KEY === selected,
							this.selectReplace
						)}
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
