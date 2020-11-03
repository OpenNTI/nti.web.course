import React from 'react';
import PropTypes from 'prop-types';
import {Hooks, Loading, Errors} from '@nti/web-commons';

import Page from './Page';

const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const isContentOutlineNode = (item) => item?.isOutlineNode && item?.hasOverviewContent;

RemainingItems.propTypes = {
	course: PropTypes.shape({
		getContentTree: PropTypes.func
	}),

	requiredOnly: PropTypes.bool,
	incompleteOnly: PropTypes.bool
};
export default function RemainingItems ({course, requiredOnly, incompleteOnly}) {
	const resolver = useResolver(async () => {
		const contentWalker = course
			.getContentTree()
			.createTreeWalker({
				skip: (...args) => !isContentOutlineNode(...args),
				ignoreChildren: isContentOutlineNode
			});

		const nodes = await contentWalker.getNodes();
		const items = await Promise.all(nodes.map(n => n.getItem()));


		return items;
	}, [course]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const lessons = isResolved(resolver) ? resolver : null;

	const [toShow, setToShow] = React.useState(0);
	const lessonsToShow = (lessons ?? []).slice(0, toShow + 1);

	return (
		<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
			{error && (<Errors.Message error={error} />)}
			{lessonsToShow.map((lesson, index) => {
				const toLoad = index === toShow ? () => setToShow(index + 1) : null;

				return (
					<Page
						key={lesson.getID()}
						lesson={lesson}
						course={course}
						requiredOnly={requiredOnly}
						incompleteOnly={incompleteOnly}

						onLoad={toLoad}
					/>
				);
			})}
		</Loading.Placeholder>
	);
}
