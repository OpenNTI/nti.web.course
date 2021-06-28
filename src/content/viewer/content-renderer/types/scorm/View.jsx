import React from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';
import { Layouts } from '@nti/web-commons';

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
};
export default function CourseContentViewerRendererScorm({ course, location }) {
	const { item } = location || {};

	const [expanded, setExpanded] = React.useState();

	return (
		<div>
			<CompletionHeader item={item} />
			<section>
				<Info item={item} small={expanded} />
				{isFlag('inline-scorm-content') && (
					<Content
						item={item}
						expanded={expanded}
						onExpand={() => setExpanded(true)}
					/>
				)}
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
