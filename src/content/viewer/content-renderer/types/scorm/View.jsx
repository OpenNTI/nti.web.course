import React from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';
import { Layouts, useReducerState } from '@nti/web-commons';

import TypeRegistry from '../Registry';

import Action from './Action';
import CompletionHeader from './CompletionHeader';
import Content from './Content';
import Info from './Info';

const { Aside, Responsive } = Layouts;

const MIME_TYPES = {
	'application/vnd.nextthought.scormcontentref': true,
};

const ActionAside = styled(Aside).attrs({ component: Action })``;

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

	const onError = e => {
		dispatch({
			expanded: false,
			error: e,
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
						onExpand={() => dispatch({ expanded: true })}
						onError={onError}
					/>
				)}
				{error && <div>Error: {error}</div>}
				<Responsive.Item
					query={Responsive.isMobileContext}
					component={Action}
					course={course}
					item={item}
				/>
				<Responsive.Item
					query={Responsive.isWebappContext}
					component={ActionAside}
					course={course}
					item={item}
				/>
			</section>
		</div>
	);
}

TypeRegistry.register(handles)(CourseContentViewerRendererScorm);
