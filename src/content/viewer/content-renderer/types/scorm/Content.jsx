import React from 'react';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-commons';

const t = scoped('web-course.content.viewer.content-renderer.types.scorm', {
	launch: 'Launch',
});

const ScormRedirect = 'scorm-redirect';

// function usePostMessage(onMessage) {
// 	React.useEffect(() => {
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
	background-color: var(--secondary-grey);
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
export default function ScormContent({ item, expanded, onExpand }) {
	return (
		<Container>
			{!expanded && <Launch onClick={onExpand}>{t('launch')}</Launch>}
			{expanded && <Iframe src={getEmbedLink(item)} />}
		</Container>
	);
}
