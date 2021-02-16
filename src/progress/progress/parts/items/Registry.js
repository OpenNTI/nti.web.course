//This was taking from nti.web.component.reports/context/abstract/Registry
//we should probably move it out into a shared location
const INSTANCE = Symbol('Instance');
const ITEMS = Symbol('Items');

const DEFAULT = Symbol('Default');

function getTypeMap(types) {
	return types.reduce((acc, type) => {
		acc[type] = true;

		return acc;
	}, {});
}

export default class Registry {
	static DEFAULT = DEFAULT;

	static register(types) {
		const registry = this;

		return function decorator(item) {
			registry.registerItem(types, item);
		};
	}

	static getInstance() {
		const Register = this;

		this[INSTANCE] = this[INSTANCE] || new Register();

		return this[INSTANCE];
	}

	static registerItem(types, item) {
		this.getInstance().register(types, item);
	}

	constructor() {
		this[ITEMS] = [];
	}

	register(types, item) {
		if (types === DEFAULT) {
			this[DEFAULT] = item;
			return;
		}

		if (!Array.isArray(types)) {
			types = [types];
		}

		for (let t of types) {
			if (this[ITEMS][t]) {
				throw new Error('Overriding existing registry item');
			}
		}

		this[ITEMS].push({
			types: getTypeMap(types),
			item,
		});
	}

	getItemFor(type) {
		for (let item of this[ITEMS]) {
			if (item.types[type]) {
				return item.item;
			}
		}

		return this[DEFAULT];
	}

	getItems() {
		return this[ITEMS].map(item => item.item);
	}
}
