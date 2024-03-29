export default function uploadCourseData(
	catalogEntry,
	zipFile,
	onComplete,
	onFailure,
	onProgress
) {
	const link = catalogEntry.getLink('Import');

	if (!link) {
		onFailure(new Error('No Link'));
	}

	const xhr = new XMLHttpRequest();
	const formData = new FormData();

	formData.append('writeout', true);
	formData.append(zipFile.name, zipFile);

	xhr.open('PUT', link, true);

	xhr.setRequestHeader('accept', 'application/json');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	xhr.upload.addEventListener('progress', e => onProgress(e));
	xhr.upload.addEventListener('load', e => onProgress(e));

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status >= 200 && xhr.status < 300) {
				onComplete(xhr.responseText);
			} else {
				onFailure({
					status: xhr.status,
					responseText: xhr.responseText,
				});
			}
		}
	};

	xhr.send(formData);
}
