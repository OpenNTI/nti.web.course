function containsUser (list, userName) {
	return (list || []).some(x => x.username === userName || x.Username === userName);
}

/**
 * Take facilitators from three different sources and merge them into a single list, determining role and
 * visibility based on the data source
 *
 * Catalog instructors:
 * {
 * 		username
 * 		JobTitle
 * 		Name
 * }
 *
 * Instructors/Editors:
 * {
 * 		alias
 * 		Username
 * }
 *
 * @param  {Array} catalogInstructors  Instructors pulled from the catalogEntry
 * @param  {Array} instructors         Instructors pulled from the courseInstance's Instructors link
 * @param  {Array} editors             Editors pulled from the courseInstance's Editors link
 * @return {Array}                     Facilitator list with role/visibility properties
 */
export function mergeAllFacilitators (catalogInstructors, instructors, editors) {
	let aggregated = [];

	(catalogInstructors || []).forEach(x => {
		let role = 'assistant';

		if(containsUser(instructors, x.username)) {
			if(containsUser(editors, x.username)) {
				role = 'instructor';
			}
		}
		else if(containsUser(editors, x.username)) {
			role = 'editor';
		}

		const visible = true;

		aggregated.push({
			role,
			visible,
			JobTitle: x.JobTitle,
			Name: x.Name,
			username: x.username,
			MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
			Class: 'CourseCatalogInstructorLegacyInfo'
		});
	});

	(instructors || []).forEach(x => {
		let role = 'assistant';

		if(containsUser(editors, x.Username)) {
			role = 'instructor';
		}

		if(containsUser(catalogInstructors, x.Username)) {
			// already added catalog instructors
			return;
		}

		// default to not visible because we've determined these aren't in catalog instructors
		// and visibility is determined by being in the catalog instructors list
		aggregated.push({
			role,
			visible: false,
			Name: x.alias,
			JobTitle: '-',
			username: x.Username,
			MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
			Class: 'CourseCatalogInstructorLegacyInfo'
		});
	});

	(editors || []).forEach(x => {
		let role = 'editor';

		if(containsUser(instructors, x.Username)) {
			// skip as we already added it from the instructors list
			return;
		}

		if(containsUser(catalogInstructors, x.Username)) {
			// already added catalog instructors
			return;
		}

		// default to not visible because we've determined these aren't in catalog instructors
		// and visibility is determined by being in the catalog instructors list
		aggregated.push({
			role,
			visible: false,
			Name: x.alias,
			JobTitle: '-',
			username: x.Username,
			MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
			Class: 'CourseCatalogInstructorLegacyInfo'
		});
	});

	return aggregated;
}
