export default function uploadCourseData(
	link,
	zipFile,
	onComplete,
	onFailure,
	onProgress,
	type
) {
	if (!link) {
		onFailure(new Error('No Link'));
	}

	const xhr = new XMLHttpRequest();
	const formData = new FormData();

	formData.append('writeout', true);
	formData.append(zipFile.name, zipFile);
	if (type === 'ImportSCORM') {
		formData.append('reset-registrations', true);
	}

	xhr.open('POST', link, true);

	xhr.setRequestHeader('accept', 'application/json');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	xhr.upload.addEventListener('progress', e => onProgress(e));
	xhr.upload.addEventListener('load', e => onProgress(e));

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					const bundle = JSON.parse(xhr.response);
					onComplete(bundle);
				} catch (e) {
					onFailure({ status: xhr.status, responseText: e });
				}
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
