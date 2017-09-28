import { ImportPanel, ImportConfirmation } from '../components/panels';

export const Import = {
	name: 'Import',
	description: 'Create a new course by importing an existing course',

	panels: [
		ImportPanel,
		ImportConfirmation
	]
};
