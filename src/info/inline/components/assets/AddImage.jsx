import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import WizardItem from '../../../../editor/wizard/WizardItem';

import CourseImageEditor from './CourseImageEditor';

const LABELS = {
	title: 'Upload a New Course Image',
	stepName: 'Preview & Adjust Size',
	buttonLabel: 'Apply Image'
};

const t = scoped('components.course.info.inline.assets.upload', LABELS);


export default class AddImage extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onFinish: PropTypes.func
	}

	state = {}

	onCancel = () => {
		const { onFinish } = this.props;

		onFinish && onFinish();
	}

	render () {
		// TODO: Re-using WizardItem is pretty convenient here, but it might be nice to pull out the core of
		// WizardItem into something more generic that both the existing WizardItem and this component can use
		return (
			<div className="add-course-assets">
				<WizardItem
					title={t('title')}
					stepName={t('stepName')}
					wizardCmp={CourseImageEditor}
					onCancel={this.onCancel}
					afterSave={this.onCancel}
					catalogEntry={this.props.catalogEntry}
					buttonLabel={t('buttonLabel')}
					keepCourseOnCancel
					firstTab
				/>
			</div>
		);
	}
}
