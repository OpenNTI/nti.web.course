import { Stores } from '@nti/lib-store';

import { sortOptions } from './utils';
import { getTypeFor, Unknown } from './types';

async function getPreferredAccess(catalogEntry) {
	try {
		const access = await catalogEntry.fetchLinkParsed(
			'UserCoursePreferredAccess'
		);

		return access;
	} catch (e) {
		return null;
	}
}

function getEnrollmentOptions(catalogEntry) {
	return Array.from(catalogEntry.getEnrollmentOptions() || []);
}

export default class CourseEnrollmentOptionsStore extends Stores.SimpleStore {
	constructor() {
		super();

		this.set('catalogEntry', null);
		this.set('options', null);

		this.set('archived', false);
		this.set('enrolled', false);
		this.set('administrative', false);

		this.set('loading', false);
		this.set('error', false);
	}

	async load(catalogEntry) {
		if (catalogEntry === this.get('catalogEntry')) {
			return;
		}

		this.set('catalogEntry', catalogEntry);
		this.set('loading', true);
		this.emitChange('loading', 'catalogEntry');
		this.setup();
	}

	setup = async () => {
		const catalogEntry = this.get('catalogEntry');

		try {
			const access = await getPreferredAccess(catalogEntry);
			const options = await Promise.all(
				(getEnrollmentOptions(catalogEntry) || [])
					.map(option => {
						const type = getTypeFor(option, access, catalogEntry);

						return type
							? type.load(option, access, catalogEntry)
							: null;
					})
					.filter(x => !!x)
			);
			const hasEnrolledOption = options.some(x => x.isEnrolled());

			if (access && !hasEnrolledOption) {
				const unknown = await Unknown.load(null, access, catalogEntry);

				options.push(unknown);
			}

			this.set('enrolled', !!access);
			this.set('administrative', access && access.isAdministrative);
			this.set('access', access);
			this.set('options', sortOptions(options));
			this.set('loading', false);
			this.emitChange(
				'loading',
				'options',
				'isAdministrative',
				'enrolled'
			);
		} catch (e) {
			this.set('error', e);
			this.set('loading', false);
			this.emitChange('loading', 'error');
		}
	};

	cleanUp() {
		this.set('catalogEntry', null);
		this.set('options', null);

		this.set('archived', false);
		this.set('enrolled', false);
		this.set('administrative', false);

		this.set('loading', false);
		this.set('error', false);
	}
}
