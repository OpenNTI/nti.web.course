import './default';

import TypeRegistry from './Registry';

const typeRegistry = TypeRegistry.getInstance();

export function getCmpFor (overrides, ...args) {
	const override = overrides ? overrides.getItemFor(...args) : null;

	return override || typeRegistry.getItemFor(...args);
}
