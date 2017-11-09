import { saveFacilitators, mergeAllFacilitators } from '../';

let savedData = null;

const mockService = () => ({
	post: (link, data) => {
		const key = 'post-' + link;

		let newData = [...(savedData[key] || []), data.user];

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

	test('Test save every type', (done) => {
		// saveFacilitators (catalogEntry, courseInstance, facilitators) {

		const catalogEntry = {
			save: (data) => {
				savedData.Instructors = data.Instructors;
			}
		};

		const courseInstance = {
			getLink: (name) => {
				return name;
			}
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
			}
		];

		saveFacilitators(catalogEntry, courseInstance, facilitators).then(() => {
			const findCatalogInstructor = (name) => {
				return savedData.Instructors.filter(x => x.username === name)[0];
			};

			// there should be 3 visible facilitators, so exactly 3 saved to catalogEntry.Instructors
			expect(savedData.Instructors.length).toBe(3);
			expect(findCatalogInstructor('ionly').Name).toEqual('I Only');
			expect(findCatalogInstructor('eonly').Name).toEqual('E Only');
			expect(findCatalogInstructor('both').Name).toEqual('Both');

			const verifyList = (list1, list2) => {
				expect(list1.length).toBe(list2.length);

				list2.forEach(x => {
					expect(list1.some(y => y === x)).toBe(true);
				});
			};

			verifyList(savedData['post-Instructors'], ['ionly', 'both', 'hiddenInstructor', 'hiddenBoth']);
			verifyList(savedData['delete-Instructors'], ['eonly', 'hiddenEditor']);
			verifyList(savedData['post-Editors'], ['eonly', 'both', 'hiddenEditor', 'hiddenBoth']);
			verifyList(savedData['delete-Editors'], ['ionly', 'hiddenInstructor']);

			done();
		});
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

		const verifyUser = (name, isVisible, role, displayName) => {
			const user = findUser(name);

			expect(user.role).toEqual(role);
			expect(user.visible).toEqual(isVisible);
			expect(user.Name).toEqual(displayName);
		};

		verifyUser('ionly', true, 'assistant', 'I Only');
		verifyUser('eonly', true, 'editor', 'E Only');
		verifyUser('both', true, 'instructor', 'Both');
		verifyUser('hiddenInstructor', false, 'assistant', 'Hidden Instructor');
		verifyUser('hiddenEditor', false, 'editor', 'Hidden Editor');
		verifyUser('hiddenBoth', false, 'instructor', 'Hidden Both');
	});
});
