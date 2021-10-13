import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.components.credit.contents', {
	label: 'Credit Hours',
	available: ' Credits Available',
	availableSingular: ' Credit Available',
	openEnrolled: 'You’re registered for the open course.',
	noCredit: '(No Credit)',
});

CreditViewContents.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	enrollmentAccess: PropTypes.object,
};

const NoCredit = styled('div').attrs({ className: 'no-credit' })`
	color: red;
`;

const EnrollmentLink = styled('div').attrs({ className: 'enroll-link' })`
	margin: 6px 0;
`;

const Link = styled.a`
	color: var(--primary-blue);
	text-decoration: none;
`;

export function CreditViewContents({ catalogEntry, enrollmentAccess }) {
	const info = catalogEntry?.Credit?.[0];
	const availableText =
		info.Hours !== 1 ? t('available') : t('availableSingular');

	return (
		<div className="content">
			<div className="hours">{info.Hours + availableText}</div>
			{!info?.Enrollment ? null : (
				<div className="enrollment">
					<EnrollmentLink>
						<Link href={info.Enrollment.url}>
							{info.Enrollment.label}
						</Link>
					</EnrollmentLink>
					{enrollmentAccess?.LegacyEnrollmentStatus !==
					'Open' ? null : (
						<div className="open-enrollment">
							<div className="open-enrolled">
								{t('openEnrolled')}
							</div>
							<NoCredit>{t('noCredit')}</NoCredit>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
