import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

const mockService = () => ({
	getObject: o => Promise.resolve(o),
	put: url => {
		if (url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	},
});

const onBefore = () => {
	setupTestClient(mockService(), 'TestUser');
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('Asset view test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test initial appearance is correct', () => {
		// const catalogEntry = {
		// 	presentationroot: '/root/',
		// 	PlatformPresentationResources: {}
		// };
		// const cmp = mount(<View catalogEntry={catalogEntry}/>);
		// function verifyType (type, expectedSrc) {
		// 	const preview = cmp.find('.asset.' + type).first();
		// 	expect(preview.find('.asset-label').first().text()).toEqual(type);
		// 	expect(preview.find('img').first().prop('src')).toEqual(expectedSrc);
		// }
		// verifyType('thumb', '/root/contentpackage-thumb-60x60.png');
		// verifyType('landing', '/root/contentpackage-landing-232x170.png');
		// verifyType('background', '/root/background.png');
		// const input = cmp.find('input').first();
		// expect(input.prop('type')).toEqual('file');
		// expect(input.prop('accept')).toEqual('.zip');
	});

	// test('Test successful upload', (done) => {
	// 	const catalogEntry = {
	// 		presentationroot: '/root/',
	// 		PlatformPresentationResources: {},
	// 		getLink: function (rel) {
	// 			return 'goodURL';
	// 		}
	// 	};

	// 	const cmp = mount(<View catalogEntry={catalogEntry}/>);

	// 	const input = cmp.find('input').first();

	// 	input.simulate('change', {
	// 		target: {
	// 			files: [
	// 				{
	// 					name: 'someFile'
	// 				}
	// 			]
	// 		}
	// 	});

	// 	expect(cmp.state().uploadInProgress).toBe(true);

	// 	setTimeout(function () {
	// 		expect(cmp.state().uploadInProgress).toBe(false);
	// 		expect(cmp.state().uploadSuccess).toBe(true);
	// 		expect(cmp.find('.upload-success').first().text()).toEqual('Upload successful');

	// 		done();
	// 	}, 200);
	// });

	// test('Test failed upload', (done) => {
	// 	const catalogEntry = {
	// 		presentationroot: '/root/',
	// 		PlatformPresentationResources: {},
	// 		getLink: function (rel) {
	// 			return 'badURL';
	// 		}
	// 	};

	// 	const cmp = mount(<View catalogEntry={catalogEntry}/>);

	// 	const input = cmp.find('input').first();

	// 	input.simulate('change', {
	// 		target: {
	// 			files: [
	// 				{
	// 					name: 'someFile'
	// 				}
	// 			]
	// 		}
	// 	});

	// 	expect(cmp.state().uploadInProgress).toBe(true);

	// 	setTimeout(function () {
	// 		expect(cmp.state().uploadInProgress).toBe(false);
	// 		expect(cmp.state().uploadSuccess).toBe(false);
	// 		expect(cmp.find('.error').first().text()).toEqual('Upload failed');

	// 		done();
	// 	}, 200);
	// });
});
