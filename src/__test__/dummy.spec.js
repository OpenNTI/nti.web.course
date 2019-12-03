/* eslint-env jest */
import {DateTime} from '@nti/web-commons';
// import moment from 'moment-timezone'; //eslint-disable-line

test('sanity check tz', () => {
	// const t = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// console.log(moment.tz.guess());
	// console.log(t);
	// console.log((new Date()).getTimezoneOffset());
	// console.log(moment.tz._names[(t || '').toLowerCase().replace(/\//g, '_')]);
	// console.log(typeof Intl);

	expect(process.env.TZ).toBe('UTC');
	expect(DateTime.format(new Date(), 'z')).toBe('UTC');
});
