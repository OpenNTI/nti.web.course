import { Stores } from '@nti/lib-store';
import { getService } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';
import { wait } from '@nti/lib-commons';

const ITEMS = '__items'; //Symbol('');
const t = scoped(
	'course.info.inline.components.transcriptcredit.managetypes.CreditTypeStore',
	{
		tooBigError: '%(field)s is too big',
		tooShortError: '%(field)s is required',
		tooLongError: '%(field)s cannot be longer than 16 characters',
		missingError: '%(field)s is required',
	}
);

const FIELD_MAP = {
	credit_type: 'Type',
	credit_units: 'Unit',
	credit_precision: 'Precision',
};

function filterError(e) {
	if (e.code === 'TooShort')
		return t('tooShortError', { field: FIELD_MAP[e.field] });

	if (e.code === 'TooBig')
		return t('tooBigError', { field: FIELD_MAP[e.field] });

	if (e.code === 'TooLong')
		return t('tooLongError', { field: FIELD_MAP[e.field] });

	if (e.code === 'RequiredMissing')
		return t('missingError', { field: FIELD_MAP[e.field] });

	return e.message || e;
}

export default class CreditTypesStore extends Stores.SimpleStore {
	static Singleton = true;

	constructor() {
		super();

		this.set({ [ITEMS]: null, error: null });

		(async () => {
			this.service = await getService();
			this.emitChange('canAddTypes');
		})();
	}

	get canAddTypes() {
		return !!this.service?.capabilities.canAddCreditTypes;
	}

	clearError() {
		this.set({ error: null });
	}

	async removeCreditType(values) {
		if (!Array.isArray(values)) values = [values].filter(Boolean);
		if (!values.length) {
			return;
		}

		try {
			const requests = values.map(async d => d.delete());
			const results = await Promise.allSettled(requests);
			const failures = results.filter(x => x.status === 'rejected');
			if (failures.length > 0) {
				throw failures[0].reason || new Error('Unknown failure');
			}

			this._load();
		} catch (e) {
			this.set({ error: filterError(e) });
		} finally {
			this.set({ loading: false });
		}
	}

	async saveCreditType(values) {
		if (!values) {
			return;
		}

		this.setImmediate({ loading: true, error: null });

		try {
			const def = this.getDefinition(values);
			const result = await def.save();
			this._load();
			return result;
		} catch (e) {
			this.set('error', filterError(e));
		} finally {
			this.set({ loading: false });
		}
	}

	getDefinition(data) {
		const items = this.get(ITEMS);
		const existing =
			data?.NTIID && items?.find(x => x.NTIID === data.NTIID);

		let definition = existing;

		if (!definition) {
			definition = {
				NTIID: data.NTIID ?? undefined,
				credit_precision: data.precision,
				credit_type: data.type,
				credit_units: data.unit,
				MimeType: 'application/vnd.nextthought.credit.creditdefinition',
				save: async () => {
					await wait.for(() => this.service.isService);
					const collection = this.service.getCollection(
						'CreditDefinitions',
						'Global'
					);

					const newGuy = await collection?.putToLink(
						'self',
						definition,
						true
					);
					this.set(ITEMS, null);
					return newGuy;
				},
			};
		}

		if (existing && existing !== data) {
			existing.type = data.type;
			existing.unit = data.unit;
			existing.precision = data.precision;
			// debugger;
		}

		return definition;
	}

	get types() {
		const t = this.get(ITEMS);
		if (t == null && !this.get('loading')) {
			this._load();
		}
		return t;
	}

	/** @private */
	async _load() {
		this.set('loading', true);
		await wait.for(() => this.service.isService);

		const defsCollection = this.service.getCollection(
			'CreditDefinitions',
			'Global'
		);

		if (defsCollection) {
			try {
				const existingTypes = await defsCollection.fetchLinkParsed(
					'self'
				);
				this.set({
					loading: false,
					[ITEMS]: existingTypes ?? [],
				});
				this.emitChange('types');
			} catch (error) {
				this.setImmediate({ error });
			}
		}
	}
}
