export default o => Object.entries(o).reduce((acc, [key, value]) => {
	return value == null ? acc : {
		...acc,
		[key]: value
	};
}, {});
