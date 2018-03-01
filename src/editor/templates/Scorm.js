import { ScormBasic, ScormImport, ImportConfirmation } from '../panels';

export const Scorm = {
	name: 'Scorm',
	description: 'Create a new scorm course by providing all of the course information.',

	panels: [
		ScormBasic,
		ScormImport,
		ImportConfirmation
	]
};
