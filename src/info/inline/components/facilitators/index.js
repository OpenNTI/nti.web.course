import {canAddFacilitators} from './utils';

export { default as View } from './View';
export { default as Edit } from './Edit';
export const ID = 'FACILITATORS';
export function isEditable (catalog, courseInstance) {
	return canAddFacilitators(courseInstance);
}
