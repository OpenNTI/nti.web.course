import React from 'react';
import {scoped} from '@nti/lib-locale';

import Description from '../../widgets/Description';

const t = scoped('course.info.inline.components.enddate.Disclaimer', {
	description: 'When class is officially over.'
});

export default function EndDateDisclaimer () {
	return (
		<Description>{t('description')}</Description>
	);
}