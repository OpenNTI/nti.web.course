import StorePrototype from 'nti-lib-store';

import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from './Constants';

const CourseSaved = Symbol('Course Saved');
const CourseSaveError = Symbol('Course Save Error');
const CourseSaving = Symbol('Course Saving');

const PRIVATE = new WeakMap();

function init (instance) {
	PRIVATE.set(instance, {

	});

	window.CourseEditorStore = instance;
}

class Store extends StorePrototype {
	constructor () {
		super();

		init(this);

		this.registerHandlers({
			[COURSE_SAVED]: CourseSaved,
			[COURSE_SAVING]: CourseSaving,
			[COURSE_SAVE_ERROR]: CourseSaveError
		});
	}

	[CourseSaved] (e) {
		this.emitChange({type: COURSE_SAVED});
	}

	[CourseSaving] (e) {
		this.emitChange({type: COURSE_SAVING});
	}

	[CourseSaveError] (e) {
		const errorMsg = (e.action && e.action.response && e.action.response.errorMsg) || 'Error saving course';

		this.emitChange({type: COURSE_SAVE_ERROR, errorMsg});
	}
}

export default new Store();
