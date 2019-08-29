import Option from '../Option';

const basicCatalogEntry = {
	getEndDate: () => null,
	getStartDate: () => null
};

/* eslint-env jest */
describe('Course enrollment open option test', () => {
	test('Test getTitle', () => {
		let enrollment = new Option({ enrolled: false }, null, basicCatalogEntry);
		expect(enrollment.getTitle()).toEqual('For Credit');
	});

	test('Test getEnrolledTitle', () => {
		let enrollment = new Option({ enrolled: true }, null, basicCatalogEntry);
		expect(enrollment.getTitle()).toEqual('For Credit');
	});

	test('Test getDescription', () => {
		let enrollment = new Option({ getEnrollCutOffDate: () => null }, null, basicCatalogEntry);
		expect(enrollment.getDescription()).toEqual('Earn transcripted college credit from the University of Oklahoma.');

		enrollment = new Option({ getEnrollCutOffDate: () => new Date('10/22/2017') }, null, basicCatalogEntry);
		expect(enrollment.getDescription()).toEqual('Earn transcripted college credit from the University of Oklahoma.  Not available after October 22nd, 2017.');
	});

	test('Test getEnrolledDescription', () => {
		// archived
		let enrollment = new Option({ enrolled: true }, null, { getEndDate: () => new Date('10/31/2017'), getStartDate: () => new Date('10/22/2017')});
		expect(enrollment.getEnrolledDescription()).toEqual('Thanks for your participation! The content of this course will remain available for you to review at any time.');

		// notArchived-startDate
		enrollment = new Option({ enrolled: false }, null, { getEndDate: () => null, getStartDate: () => new Date(Date.now() + (1000 * 60 * 60 * 48))});
		expect(enrollment.getEnrolledDescription().indexOf('Class begins ')).toEqual(0);
		expect(enrollment.getEnrolledDescription().indexOf('and will be conducted fully online.') > 0).toBe(true);

		// notArchived-noStartDate
		enrollment = new Option({ enrolled: false }, null, { getEndDate: () => new Date(Date.now() + (1000 * 60 * 60 * 48)), getStartDate: () => null});
		expect(enrollment.getEnrolledDescription()).toEqual('Class will be conducted fully online.');

	});

	test('Test getEnrollButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getEnrollButtonLabel()).toEqual('Earn College Credit');

		enrollment = new Option({'OU_Price': 400}, null, basicCatalogEntry);
		expect(enrollment.getEnrollButtonLabel().indexOf('Buy for ')).toEqual(0);
		expect(enrollment.getEnrollButtonLabel().indexOf('400') > 0).toBe(true);
	});

	test('Test getDropButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getDropButtonLabel()).toEqual('');
	});

	test('Test getOpenButtonLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getOpenButtonLabel()).toEqual('Open');
	});

	test('Test getPendingLabel', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getPendingLabel()).toEqual('Admission Pending...');
	});

	test('Test getPendingDescription', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getPendingDescription()).toEqual('We\'re processing your request to earn college credit. This process should take no more than two business days. If you believe there has been an error, please contact <a class=\'link\' href=\'mailto:support@nextthought.com\'>help desk.</a>');
	});

	test('Test getRejectedTitle', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getRejectedTitle()).toEqual('We are unable to confirm your eligibility to enroll through this process.');
	});

	test('Test getRejectedDescription', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getRejectedDescription()).toEqual('<a class=\'link\' href=\'mailto:support@nextthought.com\'>Contact the Help desk</a>');
	});

	test('Test getApiDownDescription', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getApiDownDescription()).toEqual('Transcripted credit is available from the University of Oklahoma but unfortunately we cannot process an application at this time. Please contact the <a class=\'link\' href=\'mailto:support@nextthought.com\'>help desk.</a>');
	});

	test('Test getAvailabelSeatsLabel', async () => {
		let enrollment = new Option({available: true, fetchLink: () => ({Course: { SeatAvailable: 5 } })}, null, basicCatalogEntry);
		await enrollment.load();
		expect(enrollment.getAvailabelSeatsLabel()).toEqual('5 Seats Available');

		enrollment = new Option({available: true, fetchLink: () => ({Course: { SeatAvailable: 0 } })}, null, basicCatalogEntry);
		await enrollment.load();
		expect(enrollment.getAvailabelSeatsLabel()).toEqual('No Seats Remaining');

		enrollment = new Option({available: true, fetchLink: () => ({Course: { SeatAvailable: 1 } })}, null, basicCatalogEntry);
		await enrollment.load();
		expect(enrollment.getAvailabelSeatsLabel()).toEqual('1 Seat Available');
	});

	test('Test getDropInfoTitle', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getDropInfoTitle()).toEqual('How do I drop?');
	});

	test('Test getDropInfoDescription', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getDropInfoDescription()).toEqual('Please contact your site administrator for assistance dropping the course.');
	});

	test('Test getGetAcquaintedWith', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getGetAcquaintedWith()).toEqual('Get Acquainted with the Platform');
	});

	test('Test getCompleteProfile', () => {
		let enrollment = new Option({}, null, basicCatalogEntry);
		expect(enrollment.getCompleteProfile()).toEqual('Complete Your Profile');
	});
});
