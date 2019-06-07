import {Stores} from '@nti/lib-store';


export default class ScormCollectionStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			initialLoad: false
		});
	}

	async load () {
		const {course, selected} = this.binding;

		this.set({
			selectedPackages: selected
		});

		if (course === this.course) { return; }

		this.course = course;

		if (!course.hasLink('ScormInstances')) {
			this.set({
				unavailable: true
			});
			return;
		}

		this.set({
			loading: true,
			error: null,
			packages: null
		});

		try {
			const packages = await course.fetchLinkParsed('ScormInstances');

			this.set({
				initialLoad: true,
				loading: false,
				packages,
				empty: !packages || packages.length === 0 
			});
		} catch (e) {
			this.set({
				inititalLoad: true,
				loading: false,
				error: e
			});
		}
	}


	uploadPackage (file) {
		const {course} = this.binding;
		const data = new FormData();

		data.append('source', file);

		const upload = course.putUploadToLink('ScormInstances', data, true);

		this.monitorUpload(upload);
		this.set({
			upload
		});
	}

	async monitorUpload (upload) {
		try {
			await upload;

			//TODO: add new package

			this.set({
				upload: null
			});
		} catch (e) {
			this.set({
				upload: null,
				uploadError: e
			});
		}
	}
}