import {scoped} from '@nti/lib-locale';

import {setPrice, setOpenEnrollment, update, getOpenOption} from '../utils';

const t = scoped('course.info.inline.components.access.types.free', {
	display: 'Free'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';

export const Name = 'Free';
export const displayName = t('display');

export const isAvailable = course => course.hasLink('VendorInfo');

export const isActive = course => getOpenOption(course)?.enabled;

export async function save (course) {
	await setOpenEnrollment(course, true);
	await setPrice(course, null);

	return await update(course);
}