import {scoped} from '@nti/lib-locale';

const t = scoped('course.editor.panels.instructors.index', {
	tabDescription: 'Add Facilitators'
});

export { default as WizardPanel } from './WizardPanel';
export const tabDescription = t('tabDescription');