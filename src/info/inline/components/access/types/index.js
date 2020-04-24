import * as Free from './free';
import * as Invitation from './invitation';
import * as OneTimePurchase from './one-time-purchase';

const Types = [
	Free,
	OneTimePurchase,
	Invitation
];

export function getAvailableTypes (course) {
	return Types.filter(t => t.isAvailable(course));
}

export function findActiveType (course) {
	return Types.find(t => t.isActive(course));
}

export function saveAccess (course, instance, {access}) {
	return Types.find(t => t.Name === access?.active)?.save(course, access);
}