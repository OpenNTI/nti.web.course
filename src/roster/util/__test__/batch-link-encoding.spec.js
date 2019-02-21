/* eslint-env jest */
import {encodeBatchLink, decodeBatchLink} from '../';

describe('encodes and decodes links', () => {
	test('url-encodes the encoded string', () => {
		// this url is known to include a slash when encoded
		const link = '/dataserver2/++etc++hostsites/alpha.nextthought.com/++etc++site/Courses/DefaultAPICreated/COMPLETABLE-COURSE-ID/CourseEnrollmentRoster?batchSize=1&batchStart=0&sortOn=realname&sortOrder=ascending';
		const encoded = encodeBatchLink(link);

		expect(encoded).toEqual(expect.not.stringContaining('/'));
		expect(encoded).toEqual(expect.stringContaining(encodeURIComponent('/')));
		
		const decoded = decodeBatchLink(encoded);
		expect(decoded).toEqual(link);
	});
});
