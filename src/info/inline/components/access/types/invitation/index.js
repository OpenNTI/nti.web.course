import {scoped} from '@nti/lib-locale';

import {setOpenEnrollment, setPrice, update} from '../utils';

const t = scoped('course.info.inline.components.access.types.invitation', {
	display: 'Invitation Only'
});

export Display from './Display';
export Editor from './Editor';

export const Name = 'Invitation';
export const displayName = t('display');

export const isAvailable = course => course.hasLink('VendorInfo');

export const isActive = (course) => {
	if (!course) { return false; }

	const options = course?.getEnrollmentOptions();

	if (!options) { return true; }

	for (let option of options) {
		if (option.enabled) { return false; }
	}

	return true;
};


export async function save (course) {
	await setOpenEnrollment(course, false);
	await setPrice(course, null);

	return await update(course);
}