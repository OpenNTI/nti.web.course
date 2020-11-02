import React from 'react';
import PropTypes from 'prop-types';
import {DateTime, Monitor, Hooks, Loading, Errors, Text} from '@nti/web-commons';

import Items from '../../../overview/lesson/items';
import Overview from '../../../overview/lesson/OverviewContents';
import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

const dateFormat = 'MMMM, D YYYY';

const {useResolver} = Hooks;
const {isPending, isErrored, isResolved} = useResolver;

const flatten = (items) => items.reduce((acc, item) => {
	if (item.Items) {
		return [...acc, ...item.Items];
	}

	return [...acc, item];
}, []);

const isRequired = item => item?.CompletionRequired;
const isIncomplete = item => true;//todo: fill this in

const getFilterFn = (requiredOnly, incompleteOnly) => {
	return (item) => (!requiredOnly || isRequired(item)) && (!incompleteOnly || isIncomplete(item));
};

const getItems = (overview, requiredOnly, incompleteOnly) => (
	flatten(overview?.Items ?? [])
		.filter(getFilterFn(requiredOnly, incompleteOnly))
);

RemainingItemsPage.propTypes = {
	course: PropTypes.object,
	lesson: PropTypes.shape({
		title: PropTypes.string,
		getAvailableBeginning: PropTypes.func,
		getAvailableEnding: PropTypes.func,
		getContent: PropTypes.func
	}),

	onLoad: PropTypes.func,

	requiredOnly: PropTypes.bool,
	incompleteOnly: PropTypes.bool
};
function RemainingItemsPage ({lesson, course, onLoad, requiredOnly, incompleteOnly}) {
	const resolver = useResolver(async () => {
		try {
			const content = await lesson.getContent();

			return content;
		} finally {
			onLoad?.();
		}
	}, [lesson]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const overview = isResolved(resolver) ? resolver : null;

	const items = React.useMemo(() => getItems(overview, requiredOnly, incompleteOnly), [overview, requiredOnly, incompleteOnly]);
	const hasItems = items && items.length > 0;

	const available = lesson && lesson.getAvailableBeginning();
	const ending = lesson && lesson.getAvailableEnding();

	return (
		<Loading.Placeholder loading={loading} fallback={<div style={{minHeight: '200px'}} />}>
			{error && (<Errors.Message error={error} />)}
			{hasItems && (
				<PaddedContainer>
					{available && (<DateTime format={dateFormat} date={available} />)}
					{!available && ending && (<DateTime format={dateFormat} date={ending} />)}
					<Text.Base>{overview.title}</Text.Base>
				</PaddedContainer>
			)}
			{hasItems && (
				<Items
					items={items}
					overview={overview}
					outlineNode={lesson}
					course={course}
					layout={Overview.List}

					requiredOnly={requiredOnly}
					incompleteOnly={incompleteOnly}
				/>
			)}

		</Loading.Placeholder>
	);
}

export default function RemainingItemsPageContainer (props) {
	const [onScreen, setOnScreen] = React.useState(false);

	return (
		<Monitor.OnScreen onChange={(x) => setOnScreen(onScreen || x)}>
			{onScreen && (<RemainingItemsPage {...props} />)}
		</Monitor.OnScreen>
	);
}
