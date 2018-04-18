import {dispatch} from '@nti/lib-dispatcher';
import {scoped} from '@nti/lib-locale';

import {
	COURSE_SAVED,
	COURSE_SAVING,
	COURSE_SAVE_ERROR
} from './Constants';


const t = scoped('course.editor.Actions', {
	RequiredMissing: {
		title: 'Title is required',
		ProviderUniqueID: 'Identifier is required'
	}
});

export function saveCatalogEntry (catalogEntry, data, onSaveSuccess) {
	dispatch(COURSE_SAVING);

	catalogEntry.save(data).then(() => {
		dispatch(COURSE_SAVED);

		onSaveSuccess && onSaveSuccess();
	}).catch((resp) => {
		const msg = t(`${resp.code}.${resp.field}`, { fallback: resp.message || resp });

		dispatch(COURSE_SAVE_ERROR, {
			errorMsg: msg || 'Error saving course'
		});
	});
}
