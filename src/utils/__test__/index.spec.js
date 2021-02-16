import { getImageUrl } from '../';

/* eslint-env jest */
describe('Utils test', () => {
	test('Test getImageUrl', () => {
		const catalogEntry = {
			PlatformPresentationResources: [
				{
					PlatformName: 'webapp',
					href: 'testRef',
				},
			],
		};

		expect(getImageUrl(catalogEntry)).toMatch(
			/testRef\/contentpackage-landing-/
		);
	});
});
