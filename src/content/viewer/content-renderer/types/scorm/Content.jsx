import { useEffect, useRef } from 'react';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-core';

const t = scoped('web-course.content.viewer.content-renderer.types.scorm', {
	launch: 'Launch',
});

const ScormRedirect = 'scorm-redirect';

// function usePostMessage(onMessage) {
// 	useEffect(() => {
// 		global.addEventListener?.('message', onMessage);

// 		return () => {
// 			global.removeEventListener?.('message', onMessage);
// 		};
// 	}, [onMessage]);
// }

const Container = styled.div`
	min-height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Launch = styled(Button).attrs({ rounded: true })`
	min-width: 200px;
	text-align: center;
`;

const Iframe = styled('iframe').attrs({ border: 0, frame: 0 })`
	border-top: 1px solid var(--border-grey-light);
	width: 100%;
	height: 80vh;
`;

function getEmbedLink(item) {
	const link = item?.ScormContentInfo?.getLink('LaunchSCORM');

	const redirectURL = `${global.location.origin}/app/post-query-params/${ScormRedirect}`;

	const url = new URL(link, global.location.origin);

	url.searchParams.set('redirecturl', redirectURL);

	return url.toString();
}

/**
 * Render Scorm Content
 *
 * @param {{item: {}, expanded: boolean, onExpand: () => {}}} props
 * @returns {JSX.Element}
 */
export default function ScormContent({
	item,
	expanded,
	onExpand,
	onClose,
	onError,
}) {
	const iframe = useRef();
	useEffect(() => {
		const onMessage = m => {
			const {
				source,
				origin,
				data: d,
				data: { data = d, close } = {},
			} = m;
			if (
				origin === global.origin &&
				source === iframe.current?.contentWindow
			) {
				if (data.params?.error) {
					onError?.(data.params.error);
				}
				if (close) {
					onClose?.();
				}
			}
		};
		if (expanded) {
			window?.addEventListener?.('message', onMessage);
			return () => window?.removeEventListener?.('message', onMessage);
		}
	});

	return (
		<Container>
			{!expanded && <Launch onClick={onExpand}>{t('launch')}</Launch>}
			{expanded && <Iframe src={getEmbedLink(item)} ref={iframe} />}
		</Container>
	);
}
