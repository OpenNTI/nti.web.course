import getTabError from './get-tab-error';

export default function isValidTab (tab) {
	return !getTabError(tab);
}
