import React from 'react';

import { DateTime } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';

import PublishCourse from './PublishCourse';

const t = scoped('course.info.inline.widgets.CourseVisibility', {
	makeChanges: 'Make Changes',
	inPreview: 'In Preview',
	inDraft: 'In Draft',
	yes: 'Yes',
	no: 'No',
	visibleInCatalog: 'Discoverable in Catalog',
	allowingEnrollment: 'Allowing Enrollment',
	forCredit: 'For-Credit',
	public: 'Public',
	invitationOnly: 'Invitation Only',
	noStartDate: 'No Start Date',
	startsOn: 'Starts %(date)s',
});

const startsDate = f =>
	t('startsOn', { date: f(DateTime.MONTH_ABBR_DAY_YEAR) });

//#region paint
const Launch = styled(Button)`
	background-color: var(--primary-orange);
`;

const Labeled = styled.div`
	width: 170px;
	text-align: left;
`;

const Label = styled.div`
	text-transform: uppercase;
	font-weight: 600;
	font-size: 10px;
	color: var(--tertiary-grey);

	&.alt {
		color: var(--secondary-orange);
	}
`;

const Content = styled.div`
	color: white;
	font-size: 12px;
	font-weight: 300;
	padding-top: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const LabeledContent = ({ label, children, alt }) => (
	<Labeled className="labeled-content">
		<Label className="label" alt={alt}>
			{label}
		</Label>
		<Content className="content">{children}</Content>
	</Labeled>
);

const Visible = ({ catalogEntry }) => (
	<LabeledContent label={t('visibleInCatalog')}>
		{catalogEntry.isHidden ? t('no') : t('yes')}
	</LabeledContent>
);

const PreviewStatus = ({ catalogEntry }) =>
	// what to show if not in preview mode?
	!catalogEntry.Preview ? null : (
		<LabeledContent
			label={catalogEntry.hasLink('edit') ? t('inDraft') : t('inPreview')}
			alt
		>
			{catalogEntry.getStartDate
				? DateTime.format(catalogEntry.getStartDate(), startsDate)
				: t('noStartDate')}
		</LabeledContent>
	);

const Box = styled.div`
	display: flex;
	align-items: center;
	padding: 12px;
	gap: 12px;
	background: rgba(0, 0, 0, 0.5);
	margin-bottom: 20px;
`;
//#endregion

export default function CourseVisibility({
	catalogEntry,
	courseInstance,
	onVisibilityChanged,
}) {
	const launchVisibilityDialog = () => {
		PublishCourse.show(catalogEntry, courseInstance).then(value => {
			onVisibilityChanged?.(value);
		});
	};

	return (
		<Box className="course-visibility">
			<PreviewStatus catalogEntry={catalogEntry} />
			<Visible catalogEntry={catalogEntry} />

			{/* spacer */}
			<span style={{ flex: '1 1 auto' }} />

			<Launch
				className="launch-button"
				onClick={launchVisibilityDialog}
				ph="xxl"
				rounded
			>
				{t('makeChanges')}
			</Launch>
		</Box>
	);
}
