import { scoped } from '@nti/lib-locale';

const t = scoped('course.navigation.tabs.editor.Errors', {
	tooLong: 'Must be less than 20 characters',
	onlyWhitespace: 'Cannot be blank',
});

const ERROR_CHECKS = [
	tab => {
		if (tab.label && tab.label.length > 20) {
			return t('tooLong');
		}

		return null;
	},
	tab => {
		if (tab.label && tab.label.trim().length === 0) {
			return t('onlyWhitespace');
		}

		return null;
	},
];

export default function getTabError(tab) {
	for (let check of ERROR_CHECKS) {
		const error = check(tab);

		if (error) {
			return error;
		}
	}

	return null;
}
