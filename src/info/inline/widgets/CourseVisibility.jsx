import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import cx from 'classnames';

import PublishCourse from '../../../components/PublishCourse';

const LABELS = {
	makeChanges: 'Make Changes',
	inPreview: 'In Preview',
	yes: 'Yes',
	no: 'No',
	visibleInCatalog: 'Visible in Catalog',
	allowingEnrollment: 'Allowing Enrollment',
	forCredit: 'For-Credit',
	public: 'Public',
	invitationOnly: 'Invitation Only',
	noStartDate: 'No Start Date'
};

const t = scoped('components.course.editor.inline.widgets.coursevisibility', LABELS);

export default class CourseVisibility extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onVisibilityChanged: PropTypes.func
	}

	launchVisibilityDialog = () => {
		const { catalogEntry } = this.props;

		PublishCourse.show(catalogEntry).then((value) => {
			const { onVisibilityChanged } = this.props;

			onVisibilityChanged && onVisibilityChanged(value);
		});
	}

	renderLabeledContent (label, labelCls, content) {
		const labelClassName = cx('label', labelCls);

		return (
			<div className="labeled-content">
				<div className={labelClassName}>{label}</div>
				<div className="content">{content}</div>
			</div>
		);
	}

	renderPreviewIndicator () {
		const { catalogEntry } = this.props;

		if(catalogEntry.Preview) {
			return this.renderLabeledContent(
				t('inPreview'),
				'preview',
				catalogEntry.StartDate ? DateTime.format(new Date(catalogEntry.StartDate), '[Starts ] MMM. D, YYYY') : t('noStartDate')
			);
		}
		else {
			// what to show if not in preview mode?
		}
	}

	renderAllowingEnrollment () {
		const options = this.props.catalogEntry.getEnrollmentOptions();

		const items = (options && options.Items) || {};

		const { OpenEnrollment, IMSEnrollment, FiveMinuteEnrollment, StoreEnrollment } = items;

		const isForCredit = (IMSEnrollment && IMSEnrollment.SourcedID) || FiveMinuteEnrollment;
		const isPublic = StoreEnrollment || OpenEnrollment;

		let label = t('invitationOnly');

		const parts = [isForCredit ? t('forCredit') : null, isPublic ? t('public') : null].filter(x => x);

		if(parts.length > 0) {
			label = parts.join(', ');
		}

		return this.renderLabeledContent(
			t('allowingEnrollment'),
			null,
			label
		);
	}


	renderVisibleInCatalog () {
		const { catalogEntry } = this.props;

		return this.renderLabeledContent(
			t('visibleInCatalog'),
			null,
			catalogEntry.is_non_public ? t('no') : t('yes')
		);
	}

	render () {
		return (
			<div className="course-visibility">
				{this.renderPreviewIndicator()}
				{this.renderAllowingEnrollment()}
				{this.renderVisibleInCatalog()}
				<div className="launch-button" onClick={this.launchVisibilityDialog}>{t('makeChanges')}</div>
			</div>
		);
	}
}
