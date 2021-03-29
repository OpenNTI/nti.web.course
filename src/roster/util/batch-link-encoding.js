import URL from 'url';

import { Base64 } from 'js-base64';
import QS from 'query-string';

import Logger from '@nti/util-logger';

const logger = Logger.get('roster.utils.batch-link-encoding');

export function encodeBatchLink(link) {
	return Base64.encode(link);
}

export function decodeBatchLink(encoded) {
	return Base64.decode(encoded);
}

export function parametersFromLink(link) {
	try {
		const { search } = URL.parse(link);
		return QS.parse(search);
	} catch (e) {
		logger.warn('unable to parse link. %o', link);
		return {};
	}
}
