export function getImageUrl (catalogEntry) {
	const sharedResources = (catalogEntry.PlatformPresentationResources || []).filter((r) => r.PlatformName === 'webapp');

	return (sharedResources && sharedResources.length > 0 && sharedResources[0].href) + '/contentpackage-landing-232x170.png';
}
