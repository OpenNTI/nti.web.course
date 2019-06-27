import {Stores} from '@nti/lib-store';

	
//PIN any package that is uploading, processing, or errord.
function isPinnedPackage (p) {
	return p.isTask || p.isProcessing || p.isErrored;
}

function packageMatches (p, filter) {
	if (isPinnedPackage(p)) { return true; }

	const {title} = p;

	return title && title.toLowerCase().indexOf(filter) >= 0;
}

function filterPackages (packages, filter) {
	if (!filter) { return packages; }

	return packages.filter(p => packageMatches(p, filter));
}

function getFormData (file) {
	const data = new FormData();

	data.append('source', file);

	return data;
}


function replaceIn (original, replacement, list) {
	return list.map((item) => item === original ? replacement : item);
}

export default class ScormCollectionStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			initialLoad: false
		});
	}


	get empty () {
		const fullPackages = this.get('fullPackages');

		return (fullPackages && fullPackages.length === 0);
	}


	async load () {
		const {course} = this.binding;

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
			const sorted = packages.sort((a, b) => {
				if (isPinnedPackage(a) && !isPinnedPackage(b)) { return -1; }
				if (!isPinnedPackage(a) && isPinnedPackage(b)) { return 1; }

				return a.getCreatedTime() - b.getCreatedTime();
			});

			this.set({
				initialLoad: true,
				loading: false,
				packages: sorted,
				fullPackages: sorted
			});
		} catch (e) {
			this.set({
				inititalLoad: true,
				loading: false,
				error: e
			});
		}
	}


	_prependPackage (p) {
		const oldPackages = this.get('fullPackages');
		const filter = this.get('filter');

		const newPackages = [p, ...oldPackages];

		this.set({
			packages: filterPackages(newPackages, filter),
			fullPackages: newPackages
		});
	}


	_replacePackage (oldPackage, newPackage) {
		this.set({
			packages: replaceIn(oldPackage, newPackage, this.get('packages')),
			fullPackages: replaceIn(oldPackage, newPackage, this.get('fullPackages'))
		});
	}

	_removePackage (pack) {
		this.set({
			packages: (this.get('packages') || []).filter(p => p !== pack),
			fullPackages: (this.get('fullPackages') || []).filter(p => p !== pack)
		});
	}


	async uploadPackage (file) {
		const {course} = this.binding;

		const upload = course.putUploadToLink('ScormInstances', getFormData(file), true);

		upload.setName(file.name);
		this._prependPackage(upload);

		try {
			const newPackage = await upload;

			this._replacePackage(upload, newPackage);

			if (this.binding.onPackageUploaded) {
				this.binding.onPackageUploaded(newPackage);
			}

		} catch (e) {
			if (e.wasCanceled) {
				this._removePackage(upload);
			}
		}
	}


	async deletePackage (pack) {
		if (pack.isTask) {
			return this._removePackage(pack);
		}

		let removed = false;
		const removeTimeout = setTimeout(() => {
			removed = true;
			this._removePackage(pack);
		}, 100);

		if (this.binding.onPackageDeleted) {
			this.binding.onPackageDeleted(pack);
		}

		try {
			pack.delete('delete');
		} catch (e) {
			clearTimeout(removeTimeout);

			if (removed) {
				this._prependPackage(pack);
			}
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