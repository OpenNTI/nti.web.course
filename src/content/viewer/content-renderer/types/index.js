import './calendar-event';
import './default';
// import './video';

import Webinar from './webinar';
import SCORM from './scorm';
import TypeRegistry from './Registry';

/** @type {TypeRegistry} */
const typeRegistry = TypeRegistry.getInstance();

export const TYPES = {
	Webinar,
	SCORM,
};

export function resolveComponent(overrides, ...args) {
	const primary = typeRegistry.getRegistration(...args);
	const override = overrides?.getItem(...args, primary) || null;

	return override || primary.handler;
}
