const FIELD_MAP = {
	title: 'Title',
	amount: 'Credit amount',
	credit_definition: 'Credit type',
};

const ERROR_MESSAGES = {
	RequiredMissing: e =>
		'Missing value: ' + (FIELD_MAP[e.message] || e.message),
	TooSmall: e => (FIELD_MAP[e.field] || e.field) + ' must be greater than 0.',
	InvalidFloatLiteral: e =>
		`${FIELD_MAP[e.field] || e.field} value is invalid.`,
	ConstraintNotSatisfied: e =>
		`The ${FIELD_MAP[e.field] || e.field} does not meet constraints.`,
};

export function getError(e) {
	return (ERROR_MESSAGES[e?.code] || (err => err.message || err))(e);
}
