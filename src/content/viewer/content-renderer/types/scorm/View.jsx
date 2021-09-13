import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';
import { Layouts } from '@nti/web-commons';
import { useChanges, useReducerState } from '@nti/web-core';

import TypeRegistry from '../Registry';

import Action from './Action';
import CompletionHeader from './CompletionHeader';
import Content from './Content';
import Info from './Info';
import { LaunchInfo } from './LaunchInfo';

const { Aside, Responsive } = Layouts;

const MIME_TYPES = {
	'application/vnd.nextthought.scormcontentref': true,
};

const ActionAside = styled(Aside).attrs({ component: Action })`
	/* - */
`;
const LaunchInfoAside = styled(Aside).attrs({ component: LaunchInfo })`
	/* - */
`;

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

CourseContentViewerRendererScorm.propTypes = {
	location: PropTypes.shape({
		item: PropTypes.object,
	}),
	course: PropTypes.object,
	activeHash: PropTypes.string,
};
export default function CourseContentViewerRendererScorm({
	course,
	location,
	activeHash,
}) {
	const { item } = location || {};
	const autoLaunch = activeHash === 'launch';

	const inlineContent = isFlag('inline-scorm-content');
	const [{ expanded, error }, dispatch] = useReducerState({
		expanded: inlineContent && autoLaunch,
	});

	useChanges(item?.ScormContentInfo);

	useEffect(() => {
		if (global.location.hash === `#${activeHash}`) {
			global.location.hash = '';
		}
	}, []);

	const expand = useCallback(() => {
		if (!expanded) {
			dispatch({ expanded: true, error: null });
		}
	}, [expanded, dispatch]);

	const onError = e => {
		dispatch({
			expanded: false,
			error: e,
		});
	};

	const onClose = () => {
		item?.updateCompletedItem?.();
		dispatch({
			expanded: false,
		});
	};

	const showInfo = !inlineContent || !expanded;

	return (
		<div>
			<CompletionHeader item={item} />
			<section>
				{showInfo && <Info item={item} small={expanded} />}
				{inlineContent && (
					<Content
						item={item}
						expanded={expanded}
						onExpand={expand}
						onClose={onClose}
						onError={onError}
					/>
				)}
				{error && <div>Error: {error}</div>}
				<Responsive.Item
					query={Responsive.isMobileContext}
					component={inlineContent ? LaunchInfo : Action}
					course={course}
					item={item}
					expanded={expanded}
					expand={expand}
					inline
				/>
				<Responsive.Item
					query={Responsive.isWebappContext}
					component={inlineContent ? LaunchInfoAside : ActionAside}
					course={course}
					item={item}
					expanded={expanded}
					expand={expand}
				/>
			</section>
		</div>
	);
}

TypeRegistry.register(handles)(CourseContentViewerRendererScorm);
