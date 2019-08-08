import React from 'react';
import classnames from 'classnames/bind';import {scoped} from '@nti/lib-locale';

import Description from '../../widgets/Description';


import Styles from './Disclaimer.css';

const cx = classnames.bind(Styles);

const t = scoped('course.info.inline.components.redemptioncodes.Disclaimer', {
	visibility: 'Only visible to facilitators.',
	description: 'Redemption code are a great way to grant access to your course, but there are no limitations to how many learners can use them.'
});

export default function RedemptionCodeDisclaimer () {
	return (
		<>
			<div className={cx('redemption-codes-visibility-label')}>{t('visibility')}</div>
			<Description>{t('description')}</Description>
		</>
	);
}