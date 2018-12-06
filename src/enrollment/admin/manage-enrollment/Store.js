import {Stores} from '@nti/lib-store';


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

export default class AdminEnrollmentManagementStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true
		});
	}


	async load () {
		if (this.binding.course === this.course && this.binding.user === this.user) { return; }

		this.course = this.binding.course;
		this.user = this.binding.user;

		if (this.binding.enrollment) {
			this.set({
				record: this.binding.enrollment
			});

			return;
		}

		if (!this.user.hasLink('EnrollUser') || !this.user.hasLink('UserEnrollments')) {
			this.set({
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
			const enrollment = await getUserEnrollment(this.user, this.course);

			if (enrollment && !enrollment.hasLink('CourseDrop')) {
				this.set({
					loading: false,
					record: null,
					notAuthorized: true
				});
				return;
			}

			this.set({
				loading: false,
				record: enrollment
			});
		} catch (e) {
			this.set({
				loading: false
			});
		}
	}
}
