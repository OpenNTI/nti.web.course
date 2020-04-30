import { saveFacilitators, mergeAllFacilitators, getAvailableRoles } from '../';

let savedData = null;

const mockService = (putData) => ({
	put: (link, data) => {
		const key = `put-${link}`;

		putData[key] = data;
	},
	post: (link, data) => {
		const key = 'post-' + link;

		let newData = data.users;

		savedData[key] = newData;
	},
	delete: (link) => {
		const key = 'delete-' + link.split('/')[0];

		let newData = [...(savedData[key] || []), link.split('/')[1]];

		savedData[key] = newData;
	}
});

const onBefore = () => {
	savedData = {};
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () => Promise.resolve(global.$AppConfig.nodeService)
		}
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
	savedData = null;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

/* eslint-env jest */
describe('Test saveFacilitators', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test save every type', async () => {
		// saveFacilitators (catalogEntry, courseInstance, facilitators) {
		const putData = {};
		const service = mockService(putData);
		const catalogEntry = {
			save: (data) => {
				savedData.Instructors = data.Instructors;
			}
		};

		const courseInstance = {
			getLink: (name) => {
				return name;
			},
			hasLink: name => Boolean(name),
			postToLink: (...args) => service.post(...args),
			putToLink: (...args) => service.put(...args)
		};

		const facilitators = [
			{
				role: 'assistant',
				visible: true,
				JobTitle: 'exists only in instructors',
				Name: 'I Only',
				username: 'ionly',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: 'editor',
				visible: true,
				JobTitle: 'exists only in editors',
				Name: 'E Only',
				username: 'eonly',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: 'instructor',
				visible: true,
				JobTitle: 'exists in both instructors and editors',
				Name: 'Both',
				username: 'both',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: 'assistant',
				visible: false,
				Name: 'Hidden Instructor',
				JobTitle: '-',
				username: 'hiddenInstructor',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: 'instructor',
				visible: false,
				Name: 'Hidden Both',
				JobTitle: '-',
				username: 'hiddenBoth',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: 'editor',
				visible: false,
				Name: 'Hidden Editor',
				JobTitle: '-',
				username: 'hiddenEditor',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			},
			{
				role: '',
				visible: false,
				Name: 'To Remove',
				JobTitle: '-',
				username: 'toRemove',
				MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
				Class: 'CourseCatalogInstructorLegacyInfo'
			}
		];

		await saveFacilitators(catalogEntry, courseInstance, facilitators);

		const {roles} = putData['put-roles'];
		const expectedEditors = ['eonly', 'both', 'hiddenBoth', 'hiddenEditor'];
		const expectedInstructors = ['ionly', 'both', 'hiddenInstructor', 'hiddenBoth'];

		expect(roles.editors.sort()).toEqual(expectedEditors.sort());
		expect(roles.instructors.sort()).toEqual(expectedInstructors.sort());
	});
});

describe('Test mergeAllFacilitators', () => {
	test('Test merge all combinations', () => {
		const catalogInstructors = [
			{
				username: 'ionly',
				JobTitle: 'exists only in instructors',
				Name: 'I Only'
			},
			{
				username: 'eonly',
				JobTitle: 'exists only in editors',
				Name: 'E Only'
			},
			{
				username: 'both',
				JobTitle: 'exists in both instructors and editors',
				Name: 'Both'
			}
		];

		const instructors = [
			{
				alias: 'I Only',
				Username: 'ionly'
			},
			{
				alias: 'Both',
				Username: 'both'
			},
			{
				alias: 'Hidden Instructor',
				Username: 'hiddenInstructor'
			},
			{
				alias: 'Hidden Both',
				Username: 'hiddenBoth'
			}
		];

		const editors = [
			{
				alias: 'E Only',
				Username: 'eonly'
			},
			{
				alias: 'Both',
				Username: 'both'
			},
			{
				alias: 'Hidden Editor',
				Username: 'hiddenEditor'
			},
			{
				alias: 'Hidden Both',
				Username: 'hiddenBoth'
			}
		];

		const merged = mergeAllFacilitators(catalogInstructors, instructors, editors);

		expect(merged.length).toBe(6);

		const findUser = (name) => {
			return merged.filter(x => x.username === name)[0];
		};

		const verifyUser = (name, isVisible, role, displayName, jobTitle) => {
			const user = findUser(name);

			expect(user.role).toEqual(role);
			expect(user.visible).toEqual(isVisible);
			expect(user.Name).toEqual(displayName);
			expect(user.JobTitle).toEqual(jobTitle);
		};

		verifyUser('ionly', true, 'assistant', 'I Only', 'exists only in instructors');
		verifyUser('eonly', true, 'editor', 'E Only', 'exists only in editors');
		verifyUser('both', true, 'instructor', 'Both', 'exists in both instructors and editors');
		verifyUser('hiddenInstructor', false, 'assistant', 'Hidden Instructor', 'Assistant');
		verifyUser('hiddenEditor', false, 'editor', 'Hidden Editor', 'Editor');
		verifyUser('hiddenBoth', false, 'instructor', 'Hidden Both', 'Instructor');
	});
});


describe('Test getAvailableRoles', () => {
	test('Test all options', () => {
		const courseInstance = {
			hasLink: (link) => {
				return link === 'Instructors' || link === 'Editors';
			}
		};

		const available = getAvailableRoles(courseInstance);

		expect(available.length).toBe(3);

		expect(available.includes('assistant')).toBe(true);
		expect(available.includes('editor')).toBe(true);
		expect(available.includes('instructor')).toBe(true);
	});

	test('Test only instructor', () => {
		const courseInstance = {
			hasLink: (link) => {
				return link === 'Instructors';
			}
		};

		const available = getAvailableRoles(courseInstance);

		expect(available.length).toBe(1);

		expect(available.includes('assistant')).toBe(true);
	});

	test('Test only editor', () => {
		const courseInstance = {
			hasLink: (link) => {
				return link === 'Editors';
			}
		};

		const available = getAvailableRoles(courseInstance);

		expect(available.length).toBe(1);

		expect(available.includes('editor')).toBe(true);
	});

	test('Test none', () => {
		const courseInstance = {
			hasLink: (link) => {
				return false;
			}
		};

		const available = getAvailableRoles(courseInstance);

		expect(available.length).toBe(0);
	});
});
