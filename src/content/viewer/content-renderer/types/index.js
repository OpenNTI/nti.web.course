import './default';
// import './video';

import Event from './calendar-event';
import Webinar from './webinar';
import SCORM from './scorm';
import TypeRegistry from './Registry';

const typeRegistry = TypeRegistry.getInstance();

export const TYPES = {
	Event,
	Webinar,
	SCORM,
};

export function getCmpFor(overrides, ...args) {
	const override = overrides ? overrides.getItemFor(...args) : null;

	return override || typeRegistry.getItemFor(...args);
}
