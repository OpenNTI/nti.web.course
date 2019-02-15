export default (o, preserveEmptyStrings) => Object.entries(o || {}).reduce((acc, [key, value]) => {
	return (value == null || value === '' && !preserveEmptyStrings)
		? acc
		: {
			...acc,
			[key]: value
		};
}, {});
