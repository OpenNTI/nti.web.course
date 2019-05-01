import './default';
// import './video';

import Webinar from './webinar';
import TypeRegistry from './Registry';

const typeRegistry = TypeRegistry.getInstance();

export const TYPES = {
	Webinar
};

export function getCmpFor (overrides, ...args) {
	const override = overrides ? overrides.getItemFor(...args) : null;

	return override || typeRegistry.getItemFor(...args);
}
