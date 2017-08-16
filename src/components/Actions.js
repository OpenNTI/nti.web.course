import {dispatch} from 'nti-lib-dispatcher';

import {
	COURSE_SAVED,
	COURSE_SAVING,
	COURSE_SAVE_ERROR
} from './Constants';

export function saveCatalogEntry (catalogEntry, data, onSaveSuccess) {
	dispatch(COURSE_SAVING);

	catalogEntry.save(data).then(() => {
		dispatch(COURSE_SAVED);

		onSaveSuccess && onSaveSuccess();
	}).catch((resp) => {
		dispatch(COURSE_SAVE_ERROR, {
			errorMsg: resp.message || 'Error saving course'
		});
	});
}
