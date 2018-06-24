import './five-minute';
import './open';
import './store';

import Registry from './Registry';

const registry = Registry.getInstance();

export function getTypeFor (...args) {
	return registry.getItemFor(...args);
}