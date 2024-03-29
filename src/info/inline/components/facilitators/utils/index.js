import { Presentation } from '@nti/web-commons';

export const ROLES = {
	ASSISTANT: 'assistant',
	EDITOR: 'editor',
	INSTRUCTOR: 'instructor',
};

const getUsername = x => x.Username || x.username;
export const roleDisplayName = role =>
	role.charAt(0).toUpperCase() + role.slice(1);

export function getAvailableRoles(courseInstance) {
	let options = [];

	if (courseInstance) {
		const hasEditors = courseInstance.hasLink('Editors');
		const hasInstructors = courseInstance.hasLink('Instructors');

		if (hasEditors && hasInstructors) {
			options.push(ROLES.INSTRUCTOR);
		}

		if (hasEditors) {
			options.push(ROLES.EDITOR);
		}

		if (hasInstructors) {
			options.push(ROLES.ASSISTANT);
		}
	}

	return options;
}

export function canAddFacilitators(courseInstance) {
	return (
		courseInstance &&
		courseInstance.hasLink('Instructors') &&
		courseInstance.hasLink('Editors')
	);
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
 * @returns {Promise}                Wraps the saved facilitators
 */
export async function saveFacilitators(
	catalogEntry,
	courseInstance,
	facilitators
) {
	// visible facilitators go in the catalogEntry Instructors field, hidden facilitators
	// will only be tracked through the Instructors/Editors links
	await catalogEntry.save({
		Instructors: facilitators.filter(
			x => x.visible && x.role && x.role !== ''
		),
	});

	// Content backed facilitators don't have usernames (and cannot be add/removed/managed)
	// So lets prevent operating on them.
	const userBacked = facilitators?.filter(
		x => x && x.username && !x.contentOnly
	);

	if (!userBacked || userBacked.length === 0) {
		return facilitators;
	}

	if (!courseInstance?.hasLink('roles')) {
		return facilitators;
	}

	// determine which users should be posted/deleted via the Instructors/Editors link
	//
	// editor => Editors
	// assistant => Instructors
	// instructor => Editors + Instructors

	const roles = userBacked.reduce(
		(acc, user) => {
			if (user.role === ROLES.EDITOR || user.role === ROLES.INSTRUCTOR) {
				acc.Editors.push(user);
			}

			if (
				user.role === ROLES.ASSISTANT ||
				user.role === ROLES.INSTRUCTOR
			) {
				acc.Instructors.push(user);
			}

			return acc;
		},
		{ Editors: [], Instructors: [] }
	);

	await courseInstance.putToLink('roles', {
		roles: {
			editors: roles.Editors.map(user => user?.username),
			instructors: roles.Instructors.map(user => user?.username),
		},
	});

	return facilitators.filter(user => user.role && user.role !== '');
}

function containsUser(list, userName) {
	return (list || []).some(
		x => x.username === userName || x.Username === userName
	);
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
 * @returns {Array}                     Facilitator list with role/visibility properties
 */
export function mergeAllFacilitators(
	catalogInstructors,
	instructors,
	editors,
	catalogEntry
) {
	let aggregated = [];

	function pushLegacyInstructorInfo(user, role) {
		const { alias: Name, Username: username } = user;

		// default to not visible because we've determined these aren't in catalog instructors
		// and visibility is determined by being in the catalog instructors list
		aggregated.push({
			username,
			role,
			Name,
			JobTitle: roleDisplayName(role),
			visible: false,
			MimeType:
				'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
			Class: 'CourseCatalogInstructorLegacyInfo',
		});
	}

	(catalogInstructors || []).forEach((x, index) => {
		const username = getUsername(x);
		const inInstructors = containsUser(instructors, username);
		const inEditors = containsUser(editors, username);

		const role =
			inInstructors && inEditors
				? ROLES.INSTRUCTOR
				: inEditors
				? ROLES.EDITOR
				: ROLES.ASSISTANT;

		const assetRoot = Presentation.Asset.getAssetRoot({
			contentPackage: catalogEntry,
		});
		const imageUrl =
			!username &&
			assetRoot &&
			assetRoot + '/instructor-photos/0' + (index + 1) + '.png';

		aggregated.push({
			role,
			visible: true,
			locked: !username,
			contentOnly: !inInstructors && !inEditors,
			imageUrl,
			...x,
		});
	});

	(instructors || [])
		.filter(x => !containsUser(aggregated, getUsername(x))) // filter out those we've already added
		.forEach(user => {
			const role = containsUser(editors, getUsername(user))
				? ROLES.INSTRUCTOR
				: ROLES.ASSISTANT;
			pushLegacyInstructorInfo(user, role);
		});

	(editors || [])
		.filter(x => !containsUser(aggregated, getUsername(x))) // filter out those we've already added
		.forEach(user => pushLegacyInstructorInfo(user, ROLES.EDITOR));

	return aggregated;
}

export function hasHiddenFacilitators(entry, instance) {
	return !!instance?.hasLink('roles');
}

export function getVisibleFacilitators(entry) {
	return mergeAllFacilitators(entry.Instructors, [], [], entry);
}

export async function getAllFacalitators(entry, instance) {
	const roles = await instance.fetchLink({ mode: 'raw', rel: 'roles' });

	const instructors = roles?.roles?.instructors?.Items ?? [];
	const editors = roles?.roles?.editors?.Items ?? [];

	return mergeAllFacilitators(entry.Instructors, instructors, editors, entry);
}
