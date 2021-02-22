/**
 * Given a list of groups ([{name: 'Group Name', Items: [course1, course1]}])
 * combine adjacent groups tht have the same name.
 *
 *
 * @param  {...any} groupArgs set of groups to combine
 * @returns {Array} the combined set of groups
 */
export default function combineGroups(...groupArgs) {
	const combined = [];

	for (let groups of groupArgs) {
		for (let group of groups) {
			const last = combined[combined.length - 1];

			if (last && last.name === group.name) {
				last.Items = [...last.Items, ...group.Items];
				last.error = last.error ?? group.error;
			} else {
				combined.push(group);
			}
		}
	}

	return combined;
}
