export default function uploadAssetsToCourse(course, assets, onProgress) {
	return new Promise((fulfill, reject) => {
		const link = course.getLink('presentation-assets');

		if (!link) {
			reject(new Error('No Link'));
		}

		const xhr = new XMLHttpRequest();
		const formData = new FormData();

		for (let asset of assets) {
			formData.append(asset.fileName, asset.blob);
		}

		xhr.open('PUT', link, true);

		xhr.setRequestHeader('accept', 'application/json');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		xhr.upload.addEventListener('progress', e => onProgress(e));
		xhr.upload.addEventListener('load', e => onProgress(e));

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					fulfill(xhr.responseText);
				} else {
					reject({
						status: xhr.status,
						responseText: xhr.responseText,
					});
				}
			}
		};

		xhr.send(formData);
	});
}
