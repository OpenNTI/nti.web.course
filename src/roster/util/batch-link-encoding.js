import { Base64 } from 'js-base64';
import QS from 'query-string';

import Logger from '@nti/util-logger';

const logger = Logger.get('roster.utils.batch-link-encoding');

export function encodeBatchLink(link) {
	return encodeURIComponent(Base64.encode(link));
}

export function decodeBatchLink(encoded) {
	return Base64.decode(decodeURIComponent(encoded));
}

export function parametersFromLink(link) {
	try {
		const { search } = new URL(link);
		return QS.parse(search);
	} catch (e) {
		logger.warn('unable to parse link. %o', link);
		return {};
	}
}
