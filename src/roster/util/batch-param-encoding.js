export function encodeBatchParams (params) {
	return global.btoa(params);
}

export function decodeBatchParams (encoded) {
	return global.atob(encoded);
}
