import Option from '../Option';

const basicCatalogEntry = {
	getEndDate: () => null,
	getStartDate: () => null,
};

/* eslint-env jest */
describe('Course enrollment open option test', () => {
	test('Test getTitle', () => {
		let enrollment = new Option(
			{ enrolled: false },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getTitle()).toEqual('IMIS');
	});

	test('Test getEnrolledTitle', () => {
		let enrollment = new Option(
			{ enrolled: false },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getTitle()).toEqual('IMIS');
	});

	test('Test getDescription', () => {
		let enrollment = new Option(
			{ enrolled: false },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getDescription()).toEqual(
			'Interact with content and connect with a community of learners.'
		);
	});

	// 'notArchived-startDate': 'Class begins %(fullStartDate)s and will be conducted fully online.',
	// 'notArchived-noStartDate': 'Class will be conducted fully online.',
	// 'archived-endDate': 'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
	// 'archived-noEndDate': 'The content of this course will remain available for you to review at any time'
	test('Test getEnrolledDescription', () => {
		// archived-endDate
		let enrollment = new Option({ enrolled: true }, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(
			enrollment
				.getEnrolledDescription()
				.indexOf('The course ended on October 31st')
		).toEqual(0);
		expect(
			enrollment
				.getEnrolledDescription()
				.indexOf(
					'The content of this course will remain available for you to review at any time.'
				) > 0
		).toBe(true);

		// notArchived-noStartDate
		enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => null,
		});
		expect(enrollment.getEnrolledDescription()).toEqual(
			'Class will be conducted fully online.'
		);

		// notArchived-startDate
		enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(
			enrollment
				.getEnrolledDescription()
				.indexOf('Class begins October 22nd')
		).toEqual(0);
		expect(
			enrollment
				.getEnrolledDescription()
				.indexOf('and will be conducted fully online.') > 0
		).toBe(true);
	});

	test('Test getEnrollButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getEnrollButtonLabel()).toEqual('Sign Up');
	});

	test('Test getDropButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getDropButtonLabel()).toEqual('');
	});

	test('Test getOpenButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getOpenButtonLabel()).toEqual('Open');
	});
});
