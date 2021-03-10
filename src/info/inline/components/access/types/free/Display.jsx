import React from 'react';

import { scoped } from '@nti/lib-locale';

import Label from '../../components/Label';

const t = scoped('course.info.inline.components.access.types.free.Display', {
	label: 'Free',
});

export default function FreeDisplay() {
	return <Label>{t('label')}</Label>;
}
