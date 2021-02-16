const INSTANCE = Symbol.for('Instance');
const CACHE = Symbol('Cache');

export default class Resolver {
	static resolve(...args) {
		const Cls = this;

		this[INSTANCE] = this[INSTANCE] || new Cls();

		return this[INSTANCE].resolve(...args);
	}

	constructor() {
		this[CACHE] = new WeakMap();
	}

	getCachedValue(parentage) {
		if (!Array.isArray(parentage)) {
			parentage = [parentage];
		}

		let cache = this[CACHE];

		for (let parent of parentage) {
			cache = cache.get(parent);

			if (!cache) {
				return null;
			}
		}

		return cache;
	}

	setCachedValue(parentage, value) {
		if (!Array.isArray(parentage)) {
			parentage = [parentage];
		}

		const lastParent = parentage[parentage.length - 1];
		const parents = parentage.slice(0, parentage.length - 1);
		let cache = this[CACHE];

		for (let parent of parents) {
			let parentCache = cache.get(parent);

			if (parentCache) {
				parentCache = new WeakMap();
				cache.set(parent, parentCache);
			}

			cache = parentCache;
		}

		cache.set(lastParent, value);
	}

	resolve() {
		throw new Error('resolve must be implemented by the subclass.');
	}
}
