import {scoped} from '@nti/lib-locale';

const t = scoped('course.info.inline.components.access.types.one-time-purchase', {
	display: 'One-Time Purchase'
});


export Display from './Display';
export Editor from './Editor';

export const Name = 'One-Time Purchase';
export const displayName = t('display');

const getEnrollmentOption = course => course?.getEnrollmentOptions()?.getEnrollmentOptionForPurchase();

export const isAvailable = (course) => {
	if (course.hasLink('CreateCoursePurchasable')) { return true; }

	return getEnrollmentOption(course)?.getPurchasable();
};

export const isActive = course => getEnrollmentOption(course)?.enabled;