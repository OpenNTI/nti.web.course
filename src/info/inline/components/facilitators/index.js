import {canAddFacilitators} from './utils';

export View from './View';
export Edit from './Edit';
export const ID = 'FACILITATORS';
export function isEditable (catalog, courseInstance) {
	return canAddFacilitators(courseInstance);
}
