import Option from '../Option';

//isEnrolled
//enrolledBeforeArchived
//isAvailable
//shouldOverride
//getPrice
//isGiftable
//isRedeemable
//getTitle
//getDescription
//getEnrollButtonLabel
//getEnrolledTitle
//getEnrolledDescription
//getDropButtonLabel
//getOpenButtonLabel

/* eslint-env jest */
describe('Course enrollment open option test', () => {
	test('Test isEnrolled', () => {
		let enrollment = new Option({ enrolled: true });
		expect(Boolean(enrollment.isEnrolled())).toBe(true);

		enrollment = new Option({ enrolled: false });
		expect(Boolean(enrollment.isEnrolled())).toBe(false);

		enrollment = new Option();
		expect(Boolean(enrollment.isEnrolled())).toBe(false);
	});

	test('Test enrolledBeforeArchived', () => {
		let enrollment = new Option({}, null, {
			getEndDate: () => new Date('10/22/2017'),
		});
		expect(Boolean(enrollment.enrolledBeforeArchived())).toBe(false);

		enrollment = new Option(
			{},
			{ getCreatedTime: () => new Date('10/21/2017') },
			{ getEndDate: () => new Date('10/22/2017') }
		);
		expect(Boolean(enrollment.enrolledBeforeArchived())).toBe(true);

		enrollment = new Option(
			{},
			{ getCreatedTime: () => new Date('10/23/2017') },
			{ getEndDate: () => new Date('10/22/2017') }
		);
		expect(Boolean(enrollment.enrolledBeforeArchived())).toBe(false);

		enrollment = new Option(
			{},
			{ getCreatedTime: () => new Date('10/21/2017') },
			{ getEndDate: () => null }
		);
		expect(Boolean(enrollment.enrolledBeforeArchived())).toBe(true);
	});

	test('Test isAvailable', () => {
		let enrollment = new Option();
		expect(Boolean(enrollment.isAvailable())).toBe(false);

		enrollment = new Option({ available: true });
		expect(Boolean(enrollment.isAvailable())).toBe(true);

		enrollment = new Option({ enrolled: true });
		expect(Boolean(enrollment.isAvailable())).toBe(true);

		enrollment = new Option({ enrolled: true }, { isAdministrative: true });
		expect(Boolean(enrollment.isAvailable())).toBe(false);

		enrollment = new Option(
			{ enrolled: true },
			{ isAdministrative: false }
		);
		expect(Boolean(enrollment.isAvailable())).toBe(true);
	});

	test('Test shouldOverride', () => {
		// base implementation should always return false
		let enrollment = new Option();
		expect(Boolean(enrollment.shouldOverride())).toBe(false);
	});

	test('Test getPrice', () => {
		let enrollment = new Option({});
		expect(enrollment.getPrice()).toEqual(null);

		enrollment = new Option({ Price: 5.5 });
		expect(enrollment.getPrice()).toEqual(5.5);
	});

	test('Test isGiftable', () => {
		// base implementation should always return false
		let enrollment = new Option();
		expect(Boolean(enrollment.isGiftable())).toBe(false);
	});

	test('Test isRedeemable', () => {
		// base implementation should always return false
		let enrollment = new Option();
		expect(Boolean(enrollment.isRedeemable())).toBe(false);
	});

	// these label tests should return the default, which is a missing message

	test('Test getTitle', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getTitle()).toEqual(
			'!! Missing Title for TestClass !!'
		);
	});

	test('Test getDescription', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getDescription()).toEqual(
			'!! Missing Description for TestClass !!'
		);
	});

	test('Test getEnrollButtonLabel', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getEnrollButtonLabel()).toEqual(
			'!! Missing Enroll Button Label for TestClass !!'
		);
	});

	test('Test getEnrolledTitle', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getEnrolledTitle()).toEqual(
			'!! Missing Enrolled Title for TestClass !!'
		);
	});

	test('Test getEnrolledDescription', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getEnrolledDescription()).toEqual(
			'!! Missing Enrolled Description for TestClass !!'
		);
	});

	test('Test getDropButtonLabel', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getDropButtonLabel()).toEqual(
			'!! Missing Enrolled Description for TestClass !!'
		);
	});

	test('Test getOpenButtonLabel', () => {
		let enrollment = new Option({ Class: 'TestClass' });
		expect(enrollment.getOpenButtonLabel()).toEqual(
			'!! Missing Open Button label for TestClass !!'
		);
	});
});
