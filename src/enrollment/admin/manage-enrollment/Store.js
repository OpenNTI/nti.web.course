import {Stores} from '@nti/lib-store';
import {getService, User} from '@nti/web-client';

import {getTypeFor, Unknown} from '../../options/types';

async function resolveUser (user) {
	try {
		return User.resolve({entity: user});
	} catch (e) {
		return null;
	}
}

async function resolveCourse (course) {
	if (course && typeof course !== 'string') {
		return course;
	}

	try {
		const service = await getService();
		const resolved = await service.getObject(course);

		return resolved;
	} catch (e) {
		return null;
	}
}

async function getUserEnrollment (user, course) {
	try {
		const enrollments = await user.fetchLinkParsed('UserEnrollments');

		for (let enrollment of enrollments) {
			if (enrollment.CatalogEntry.getID() === course.getID()) {
				return enrollment;
			}
		}
	} catch (e) {
		return null;
	}
}

async function getEnrollmentOptions (catalogEntry, enrollment) {
	const catalogOptions = Array.from(catalogEntry.getEnrollmentOptions() || []);

	const options = await Promise.all(
		(catalogOptions || [])
			.map((option) => {
				const type = getTypeFor(option, enrollment, catalogEntry);

				return type ? type.load(option, enrollment, catalogEntry) : null;
			})
			.filter(x => !!x)
	);

	const hasEnrolledOption = options.some(option => option.isEnrolled());

	if (!hasEnrolledOption && enrollment) {
		const unknown = await Unknown.load(null, enrollment, catalogEntry);

		options.push(unknown);
	}

	return options;
}

export default class AdminEnrollmentManagementStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true
		});
	}


	async load () {
		if (this.binding.course === this.course && this.binding.user === this.user) { return; }

		this.course = await resolveCourse(this.binding.course);
		this.user = await resolveUser(this.binding.user);
		this.enrollment = this.binding.enrollment;

		if (!this.user || !this.user.hasLink('EnrollUser') || !this.user.hasLink('UserEnrollments')) {
			this.set({
				loading: false,
				record: null,
				notAuthorized: true
			});
			return;
		}

		this.set({
			loading: true,
			record: null,
			notAuthorized: false
		});


		try {
			const enrollment = this.enrollment || await getUserEnrollment(this.user, this.course);

			if (enrollment && !enrollment.hasLink('CourseDrop')) {
				this.set({
					loading: false,
					record: null,
					notAuthorized: true
				});
				return;
			}

			const options = await getEnrollmentOptions(this.course, enrollment);

			this.set({
				loading: false,
				record: enrollment,
				options
			});
		} catch (e) {
			this.set({
				loading: false,
				notAuthorized: true
			});
		}
	}


	async dropCourse () {
		const enrollment = this.get('record');

		if (!enrollment) { return; }

		this.set({loading: true, error: null});

		try {
			await enrollment.requestLink('CourseDrop', 'delete');

			const options = await getEnrollmentOptions(this.course, null);

			this.set({
				loading: false,
				record: null,
				options
			});

			if (this.binding.onChange) {
				this.binding.onChange();
			}

		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}


	async enrollInScope (scope) {
		const {course, user} = this;

		this.set({loading: true, error: null});

		const params = {ntiid: course.NTIID};

		if (scope) {
			params.scope = scope;
		}

		try {
			const service = await getService();
			const enrollment = await service.postParseResponse(user.getLink('EnrollUser'), params);

			if (!enrollment || !enrollment.hasLink('CourseDrop')) {
				this.set({
					loading: false,
					record: null,
					notAuthorized: true
				});
				return;
			}

			const options = await getEnrollmentOptions(this.course, enrollment);

			this.set({
				loading: false,
				record: enrollment,
				options
			});

			if (this.binding.onChange) {
				this.binding.onChange();
			}
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}


	enrollInOption (option) {
		return this.enrollInScope(option && option.getScope());
	}
}
