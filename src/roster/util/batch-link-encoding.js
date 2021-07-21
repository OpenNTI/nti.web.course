import { Base64 } from 'js-base64';

import Logger from '@nti/util-logger';

const logger = Logger.get('roster.utils.batch-link-encoding');

const ensureArray = x => (Array.isArray(x) ? x : [x]);
const append = (obj, key, newValue) =>
	(obj[key] = [...ensureArray(obj[key]), newValue]);

export function encodeBatchLink(link) {
	return encodeURIComponent(Base64.encode(link));
}

export function decodeBatchLink(encoded) {
	return Base64.decode(decodeURIComponent(encoded));
}

export function parametersFromLink(link) {
	try {
		const { searchParams } = new URL(link);

		const params = {};
		for (const [key, value] of searchParams) {
			if (key in params) {
				// handle duplicate params...
				append(params, key, value);
			} else {
				params[key] = value;
			}
		}
		return params;
	} catch (e) {
		logger.warn('unable to parse link. %o', link);
		return {};
	}
}
