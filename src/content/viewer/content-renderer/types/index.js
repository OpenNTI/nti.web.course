import './calendar-event';
import './default';
// import './video';

import Webinar from './webinar';
import SCORM from './scorm';
import TypeRegistry from './Registry';

const typeRegistry = TypeRegistry.getInstance();

export const TYPES = {
	Webinar,
	SCORM,
};

export function getCmpFor(overrides, ...args) {
	const override = overrides?.getItem(...args) || null;

	return override || typeRegistry.getItem(...args);
}
