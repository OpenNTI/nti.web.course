import {scoped} from '@nti/lib-locale';

const t = scoped('course.info.inline.components.access.types.free', {
	display: 'Free'
});

export Display from './Display';
export Editor from './Editor';

export const Name = 'Free';
export const displayName = t('display');

export const isAvailable = course => course.hasLink('VendorInfo');

export const isActive = course => course?.getEnrollmentOptions()?.getEnrollmentOptionForOpen()?.enabled;