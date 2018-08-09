import './Administrative';
import './CatalogEntry';
import './Enrollment';
import './Instance';

import Registry from './Registry';

const registry = Registry.getInstance();

export function getComponentFor (...args) {
	return registry.getItemFor(...args);
}
