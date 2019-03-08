import './default';

import TypeRegistry from './Registry';

const typeRegistry = TypeRegistry.getInstance();

export function getCmpFor (...args) {
	return typeRegistry.getItemFor(...args);
}
