import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Description from '../../widgets/Description';

const t = scoped('course.info.inline.components.pricing.View', {
	label: 'Pricing',
	description: 'Set a price for your course, or offer it for free.'
});

CoursePricingContent.propTypes = {
	children: PropTypes.any,
	extra: PropTypes.any
};
export default function CoursePricingContent ({children, extra}) {
	return (
		<div className="columned pricing">
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
				<Description>{t('description')}</Description>
				{extra}
			</div>
			<div className="content-column">
				{children}
			</div>
		</div>
	);
}