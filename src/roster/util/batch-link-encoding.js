import URL from 'url';

import Logger from '@nti/util-logger';
import QS from 'query-string';

const logger = Logger.get('roster.utils.batch-link-encoding');

export function encodeBatchLink (link) {
	return utoa(link);
}

export function decodeBatchLink (encoded) {
	return atou(encoded);
}

export function parametersFromLink (link) {
	try {
		const {search} = URL.parse(link);
		return QS.parse(search);
	}
	catch (e) {
		logger.warn('unable to parse link. %o', link);
		return {};
	}
}

// btoa may choke on unicode chars, so…
function utoa (str) {
	return global.btoa(unescape(encodeURIComponent(str)));
}

function atou (str) {
	return decodeURIComponent(escape(global.atob(str)));
}
