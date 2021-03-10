import React from 'react';

import { scoped } from '@nti/lib-locale';

import Label from '../../components/Label';

const t = scoped(
	'course.info.inline.components.access.types.invitations.Display',
	{
		label: 'Invitation Only',
	}
);

export default function InvitationDisplay() {
	return <Label>{t('label')}</Label>;
}
