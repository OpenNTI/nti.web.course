import React from 'react';
import {scoped} from '@nti/lib-locale';

import Description from '../../widgets/Description';

const t = scoped('course.info.inline.components.startdate.Disclaimer', {
	description: 'Delay when people can start.'
});

export default function StartDateDisclaimer () {
	return (
		<Description>{t('description')}</Description>
	);
}