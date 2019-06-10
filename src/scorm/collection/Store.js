import {Stores} from '@nti/lib-store';


function packageMatches (p, filter) {
	const {title} = p;

	return title && title.toLowerCase().indexOf(filter) >= 0;
}

function filterPackages (packages, filter) {
	if (!filter) { return packages; }

	return packages.filter(p => packageMatches(p, filter));
}

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
			packages: null,
			filter: '',
		});

		try {
			const packages = await course.fetchLinkParsed('ScormInstances');

			this.set({
				initialLoad: true,
				loading: false,
				packages,
				fullPackages: packages,
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


	setFilter (filter) {
		const packages = this.get('fullPackages');

		this.setImmediate({
			filter,
			packages: filterPackages(packages, filter.toLowerCase())
		});


	}
}