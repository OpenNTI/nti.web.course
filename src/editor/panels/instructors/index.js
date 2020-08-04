import {scoped} from '@nti/lib-locale';

const t = scoped('course.editor.panels.instructors.index', {
	tabDescription: 'Add Facilitators'
});

export WizardPanel from './WizardPanel';
export const tabDescription = t('tabDescription');