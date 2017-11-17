import { getService } from 'nti-web-client';

export function getAvailableRoles (courseInstance) {
	let options = [];

	if(courseInstance && courseInstance.hasLink('Instructors') && courseInstance.hasLink('Editors')) {
		options.push('instructor');
	}

	if(courseInstance && courseInstance.hasLink('Editors')) {
		options.push('editor');
	}

	if(courseInstance && courseInstance.hasLink('Instructors')) {
		options.push('assistant');
	}

	return options;
}

async function saveItem (service, link, type, user) {
	if(type === 'delete') {
		await service.delete(link);
	}
	else if (type === 'post') {
		await service.post(link, { user });
	}
}

/**
 * Save facilitator data to the appropriate places, according to the following rules:
 *
 * 1) Only facilitators with visible=true are saved to the catalogEntry's Instructors
 * 2) Facilitators with role=assistant are saved only to the Instructors link on courseInstance, deleted from Editors link
 * 3) Facilitators with role=editor are saved only to the Editors link on courseInstance, deleted from Instructors link
 * 4) Facilitators with role=instructor are saved to both Instructors link and Editors link on courseInstance
 *
 * @param  {Object} catalogEntry    Catalog entry containing Instructors field
 * @param  {Object} courseInstance  Course instance containing Instructors/Editors link
 * @param  {Array} facilitators     List of facilitators modeled similarly to catalogEntry.Instructors
 * @return {Promise}                Wraps the saved facilitators
 */
export async function saveFacilitators (catalogEntry, courseInstance, facilitators) {
	if(!facilitators || facilitators.length === 0) {
		return;
	}

	// visible facilitators go in the catalogEntry Instructors field, hidden facilitators
	// will only be tracked through the Instructors/Editors links
	await catalogEntry.save({Instructors: facilitators.filter(x => x.visible && x.role && x.role !== '')});

	const service = await getService();

	const instructorsLink = courseInstance && courseInstance.getLink('Instructors');
	const editorsLink = courseInstance && courseInstance.getLink('Editors');

	if(!instructorsLink || !editorsLink) {
		return;
	}

	// determine which users should be posted/deleted via the Instructors/Editors link
	//
	// editor => Editors
	// assistant => Instructors
	// instructor => Editors + Instructors
	const editorsToSave = facilitators.filter(x => x.role === 'editor' || x.role === 'instructor');
	const instructorsToSave = facilitators.filter(x => x.role === 'assistant' || x.role === 'instructor');

	const editorsToRemove = facilitators.filter(x => x.role !== 'editor' && x.role !== 'instructor');
	const instructorsToRemove = facilitators.filter(x => x.role !== 'assistant' && x.role !== 'instructor');

	// do the POST/DELETE calls
	instructorsToSave.forEach(x => {
		saveItem(service, instructorsLink, 'post', x.username);
	});

	instructorsToRemove.forEach(x => {
		saveItem(service, instructorsLink + '/' + x.username, 'delete', x.username);
	});

	editorsToSave.forEach(x => {
		saveItem(service, editorsLink, 'post', x.username);
	});

	editorsToRemove.forEach(x => {
		saveItem(service, editorsLink + '/' + x.username, 'delete', x.username);
	});

	return facilitators.filter(x => x.role && x.role !== '');
}

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
 * @param  {Object} catalogEntry       Course these instructors are applied to
 * @return {Array}                     Facilitator list with role/visibility properties
 */
export function mergeAllFacilitators (catalogInstructors, instructors, editors, catalogEntry) {
	let aggregated = [];

	(catalogInstructors || []).forEach((x, index) => {
		let role = 'assistant';

		const assetRoot = catalogEntry && catalogEntry.getAssetRoot();

		let imageUrl;

		if(assetRoot) {
			imageUrl = assetRoot + '/instructor-photos/0' + (index + 1) + '.png';
		}

		if(containsUser(instructors, x.username)) {
			if(containsUser(editors, x.username)) {
				role = 'instructor';
			}
		}
		else if(containsUser(editors, x.username)) {
			role = 'editor';
		}

		const visible = true;

		let newObject = {
			role,
			visible,
			...x
		};

		if(imageUrl) {
			newObject.imageUrl = imageUrl;
		}

		if(!x.username || x.username === '') {
			newObject.locked = true;
		}

		aggregated.push(newObject);
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
