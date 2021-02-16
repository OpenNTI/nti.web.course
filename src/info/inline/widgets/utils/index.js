export function validateTag(value) {
	let errors = new Set();

	if (!value) {
		return Array.from(errors); // should this count as invalid?
	}

	const parts = value.trim().split('/');

	const regex = /\.$|\.{2,}/;

	if (parts.length > 1) {
		errors.add("'/' characters are not allowed");
	}

	const areAllValid = parts.every(x => {
		const remaining = x.replace(/(^[.\s]+)|([.\s]+$)/g, '');

		return !regex.test(x) && remaining.length > 0;
	});

	if (!areAllValid) {
		errors.add('Invalid tag name');
	}

	return Array.from(errors);
}
