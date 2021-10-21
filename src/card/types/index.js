import './Administrative';
import './CatalogEntry';
import './Enrollment';
import './Instance';

import Registry from './Registry';

export function getComponent(...args) {
	return Registry.getInstance().getItem(...args);
}
