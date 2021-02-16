import Option from '../Option';

/* eslint-env jest */
describe('Course enrollment open option test', () => {
	test('Test getTitle', () => {
		let enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => null,
		});
		expect(enrollment.getTitle()).toEqual('Basic');

		enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getTitle()).toEqual('Archived');
	});

	test('Test getEnrolledTitle', () => {
		let enrollment = new Option({ enrolled: true }, null, {
			getEndDate: () => null,
			getStartDate: () => null,
		});
		expect(enrollment.getTitle()).toEqual('Basic');

		enrollment = new Option({ enrolled: true }, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getTitle()).toEqual('Archived');
	});

	test('Test getDescription', () => {
		let enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => null,
		});
		expect(enrollment.getDescription()).toEqual(
			'Interact with content and connect with a community of learners.'
		);
	});

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
		let enrollment = new Option({}, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getEnrollButtonLabel()).toEqual('Get for Free');
	});

	test('Test getDropButtonLabel', () => {
		let enrollment = new Option({}, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getDropButtonLabel()).toEqual('Remove');
	});

	test('Test getOpenButtonLabel', () => {
		let enrollment = new Option({}, null, {
			getEndDate: () => new Date('10/31/2017'),
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getOpenButtonLabel()).toEqual('Open');
	});
});
