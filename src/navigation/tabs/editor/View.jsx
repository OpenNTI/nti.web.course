import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';
import { Button } from "@nti/web-core";
import { scoped } from '@nti/lib-locale';

import Store from './Store';
import Tab from './Tab';

const t = scoped('course.navigation.tabs.editor.View', {
	title: 'Configure Tab Names',
	description: 'Customize how the tabs appear in this course.',
	saving: 'Saving',
	save: 'Save',
	cancel: 'Cancel',
	unknownError: 'Unable to load course tabs',
	unknownSavingError: 'Unable to save tab changes',
});

class CourseNavigationTabsEditor extends React.Component {
	static deriveBindingFromProps(props) {
		return props.course;
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		page: PropTypes.bool,

		loading: PropTypes.bool,
		error: PropTypes.any,
		canEdit: PropTypes.bool,
		hasChanged: PropTypes.bool,
		saving: PropTypes.bool,
		savingError: PropTypes.any,
		valid: PropTypes.bool,
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				default: PropTypes.string,
				label: PropTypes.string,
			})
		),
		updateTabLabel: PropTypes.func,
		cancelChanges: PropTypes.func,
		saveChanges: PropTypes.func,
	};

	onTabChange = (id, label) => {
		const { updateTabLabel } = this.props;

		if (updateTabLabel) {
			updateTabLabel(id, label);
		}
	};

	onCancel = () => {
		const { cancelChanges } = this.props;

		if (cancelChanges) {
			cancelChanges();
		}
	};

	onSave = () => {
		const { saveChanges } = this.props;

		if (saveChanges) {
			saveChanges();
		}
	};

	render() {
		const { loading, saving, error, page } = this.props;

		return (
			<div
				className={cx('nti-course-tab-editor', {
					'tab-editor-page': page,
				})}
			>
				{loading && <Loading.Mask />}
				{!loading && saving && (
					<div className="saving-container">
						<Loading.Mask message={t('saving')} />
					</div>
				)}
				{!loading && error && this.renderError()}
				{!loading && !error && this.renderTabs()}
			</div>
		);
	}

	renderError() {
		const { error } = this.props;

		return (
			<div className="loading-error">
				{error.Message || error.message || t('unknownError')}
			</div>
		);
	}

	renderTabs() {
		const { tabs, canEdit, valid, hasChanged, savingError } = this.props;

		if (!tabs) {
			return null;
		}

		return (
			<>
				<div className="title">{t('title')}</div>
				<div className="description">{t('description')}</div>
				{savingError && (
					<div className="saving-error">
						{savingError.Message ||
							savingError.message ||
							t('unknownSavingError')}
					</div>
				)}
				<ul className="tabs">
					{tabs.map(tab => {
						return (
							<li key={tab.id}>
								<Tab
									tab={tab}
									onTabChange={this.onTabChange}
									readonly={!canEdit}
								/>
							</li>
						);
					})}
				</ul>
				{canEdit && (
					<div className="controls">
						<Button
							className="save"
							rounded
							onClick={this.onSave}
							disabled={!hasChanged || !valid}
						>
							{t('save')}
						</Button>
						{hasChanged && (
							<Button
								className="cancel"
								secondary
								rounded
								onClick={this.onCancel}
							>
								{t('cancel')}
							</Button>
						)}
					</div>
				)}
			</>
		);
	}
}

export default decorate(CourseNavigationTabsEditor, [
	Store.connect([
		'loading',
		'error',
		'saving',
		'savingError',
		'canEdit',
		'hasChanged',
		'valid',
		'tabs',
		'updateTabLabel',
		'cancelChanges',
		'saveChanges',
	]),
]);
