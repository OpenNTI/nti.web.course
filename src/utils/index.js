//FIXME: unify with Presentation Assets in web-commons
export function getImageUrl(catalogEntry) {
	const sharedResources = (
		catalogEntry.PlatformPresentationResources || []
	).filter(r => r.PlatformName === 'webapp');

	return (
		(sharedResources &&
			sharedResources.length > 0 &&
			sharedResources[0].href) + '/contentpackage-landing-232x170.png'
	);
}

export const stop = e => e && e.stopPropagation();
export const block = e => e && (stop(e), e.preventDefault());
