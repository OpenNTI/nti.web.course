import {scoped} from '@nti/lib-locale';

import {getPurchaseOption, setOpenEnrollment, setPrice, update} from '../utils';

const t = scoped('course.info.inline.components.access.types.one-time-purchase', {
	display: 'One-Time Purchase'
});


export { default as Display } from './Display';
export { default as Editor } from './Editor';

export const Name = 'One-Time Purchase';
export const displayName = t('display');

export const isAvailable = (course) => {
	if (course.hasLink('CreateCoursePurchasable')) { return true; }

	return getPurchaseOption(course)?.getPurchasable();
};

export const isActive = course => getPurchaseOption(course)?.enabled;

export async function save (course, {price}) {
	if (!price?.amount) { throw new Error('Must have a price'); }

	await setOpenEnrollment(course, false);
	await setPrice(course, price);

	return await update(course);
}