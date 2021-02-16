import Option from '../Option';

const optionWithPurchasables = {
	available: true,
	getPurchasable: () => ({ amount: 500 }),
	getPurchasableForGifting: () => ({ amount: 600 }),
	getPurchasableForRedeeming: () => ({ amount: 700 }),
};

const basicCatalogEntry = {
	getEndDate: () => null,
	getStartDate: () => null,
};

/* eslint-env jest */
describe('Course enrollment store option test', () => {
	test('Test getTitle', () => {
		let enrollment = new Option(
			{ enrolled: false },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getTitle()).toEqual('Premium');
	});

	test('Test getEnrolledTitle', () => {
		let enrollment = new Option(
			{ enrolled: true },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getTitle()).toEqual('Premium');
	});

	test('Test getDescription', () => {
		let enrollment = new Option(
			{ enrolled: false },
			null,
			basicCatalogEntry
		);
		expect(enrollment.getDescription()).toEqual(
			'Complete access to interact with all of the content.'
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

		// notArchived-started
		enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => new Date(Date.now() + 1000 * 60 * 60 * 48),
		});
		expect(
			enrollment.getEnrolledDescription().indexOf('The course begins on ')
		).toEqual(0);
		expect(
			enrollment
				.getEnrolledDescription()
				.indexOf('and will be conducted fully online.') > 0
		).toBe(true);

		// notArchived-started
		enrollment = new Option({ enrolled: false }, null, {
			getEndDate: () => null,
			getStartDate: () => new Date('10/22/2017'),
		});
		expect(enrollment.getEnrolledDescription()).toEqual(
			'You now have access to interact with all course content including the lectures, course materials, quizzes, and discussions.'
		);
	});

	test('Test getEnrollButtonLabel', async () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getEnrollButtonLabel()).toEqual('Purchase');

		// purchasable case, need to call load to setup purchasable
		enrollment = new Option(
			optionWithPurchasables,
			null,
			basicCatalogEntry
		);
		await enrollment.load();
		expect(enrollment.getEnrollButtonLabel().indexOf('Buy for ')).toEqual(
			0
		);
		expect(enrollment.getEnrollButtonLabel().indexOf('500') > 0).toBe(true);
	});

	test('Test getDropButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getDropButtonLabel()).toEqual('');
	});

	test('Test getOpenButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getOpenButtonLabel()).toEqual('Open');
	});

	test('Test getGiftTitle', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getGiftTitle()).toEqual('Give This Course as a Gift');
	});

	test('Test getGiftLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getGiftLabel()).toEqual('Lifelong Learner Only');
	});

	test('Test getRedeemTitle', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getRedeemTitle()).toEqual('Redeem a Gift');
	});

	test('Test isGiftable', async () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(Boolean(enrollment.isGiftable())).toBe(false);

		enrollment = new Option(
			optionWithPurchasables,
			null,
			basicCatalogEntry
		);
		await enrollment.load();
		expect(Boolean(enrollment.isGiftable())).toBe(true);
	});

	test('Test isRedeemable', async () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(Boolean(enrollment.isRedeemable())).toBe(false);

		enrollment = new Option(
			optionWithPurchasables,
			null,
			basicCatalogEntry
		);
		await enrollment.load();
		expect(Boolean(enrollment.isRedeemable())).toBe(true);
	});
});
