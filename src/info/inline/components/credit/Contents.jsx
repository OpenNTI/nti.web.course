import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.components.credit.contents', {
	label: 'Credit Hours',
	available: ' Credits Available',
	availableSingular: ' Credit Available',
	openEnrolled: 'You’re registered for the open course.',
	noCredit: '(No Credit)',
});

export default class CreditViewContents extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object,
	};

	static FIELD_NAME = 'Credit';

	constructor(props) {
		super(props);

		this.state = {};
	}

	renderOpen() {
		const { enrollmentAccess } = this.props;

		if (
			enrollmentAccess &&
			enrollmentAccess.LegacyEnrollmentStatus &&
			enrollmentAccess.LegacyEnrollmentStatus === 'Open'
		) {
			return (
				<div className="open-enrollment">
					<div className="open-enrolled">{t('openEnrolled')}</div>
					<div className="no-credit">{t('noCredit')}</div>
				</div>
			);
		}
	}

	renderEnrollment() {
		const { catalogEntry } = this.props;

		const info = catalogEntry[CreditViewContents.FIELD_NAME][0];

		if (info.Enrollment) {
			return (
				<div className="enrollment">
					<div className="enroll-link">
						<a href={info.Enrollment.url}>
							{info.Enrollment.label}
						</a>
					</div>
					{this.renderOpen()}
				</div>
			);
		}
	}

	render() {
		const { catalogEntry } = this.props;

		const info = catalogEntry[CreditViewContents.FIELD_NAME][0];

		const availableText =
			info.Hours !== 1 ? t('available') : t('availableSingular');

		return (
			<div className="content">
				<div className="hours">{info.Hours + availableText}</div>
				{this.renderEnrollment()}
			</div>
		);
	}
}
