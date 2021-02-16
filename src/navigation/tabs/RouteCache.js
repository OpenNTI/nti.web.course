const ROUTE_CACHE = {};

export default {
	set(root, route) {
		ROUTE_CACHE[root] = route;
	},

	get(root) {
		return ROUTE_CACHE[root] || root;
	},
};
