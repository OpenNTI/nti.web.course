import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
	DateTime,
	Monitor,
	Hooks,
	Loading,
	Errors,
	Text,
} from '@nti/web-commons';

import Items from '../../../overview/lesson/items';
import Overview from '../../../overview/lesson/OverviewContents';
import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Styles from './Style.css';
import CompletionStatus from './CompletionStatus';

const dateFormat = DateTime.MONTH_NAME_DAY_YEAR;

const { useResolver, useMobileValue } = Hooks;
const { isPending, isErrored, isResolved } = useResolver;

const flatten = items =>
	items.reduce((acc, item) => {
		if (item.Items) {
			return [...acc, ...flatten(item.Items)];
		}

		return [...acc, item];
	}, []);

const isRequired = item => item?.CompletionRequired;
const isIncomplete = (item, completedItems) => {
	if (completedItems && !item.CompletedItem) {
		return CompletionStatus.getCompletedDate(item, completedItems) == null;
	}

	if (!item.hasCompleted) {
		return false;
	}

	return !item.hasCompleted() || !item.completedSuccessfully();
};

const getFilterFn = (completedItems, requiredOnly, incompleteOnly) => {
	return item =>
		(!requiredOnly || isRequired(item, completedItems)) &&
		(!incompleteOnly || isIncomplete(item, completedItems));
};

const getItems = (
	overview,
	completedItems,
	requiredOnly,
	incompleteOnly,
	itemInclusionFilter
) =>
	flatten(overview?.Items ?? [])
		.filter(getFilterFn(completedItems, requiredOnly, incompleteOnly))
		.filter(itemInclusionFilter);

const Placeholder = () => (
	<div className={Styles['page-placeholder']}>
		<div className={Styles.placeholder} />
		<div className={Styles.placeholder} />
		<div className={Styles.placeholder} />
	</div>
);

RemainingItemsPage.propTypes = {
	course: PropTypes.object,
	enrollment: PropTypes.object,
	enrollmentCompletedItems: PropTypes.object,
	lesson: PropTypes.shape({
		title: PropTypes.string,
		getAvailableBeginning: PropTypes.func,
		getAvailableEnding: PropTypes.func,
		getContent: PropTypes.func,
	}),

	onWaterfallLoadContinue: PropTypes.func,
	itemInclusionFilter: PropTypes.func,

	requiredOnly: PropTypes.bool,
	incompleteOnly: PropTypes.bool,
};
function RemainingItemsPage({
	lesson,
	course,
	enrollment,
	enrollmentCompletedItems,
	onWaterfallLoadContinue,
	requiredOnly,
	incompleteOnly,
	itemInclusionFilter,
}) {
	const extraColumns = useMobileValue(undefined, [CompletionStatus]);

	const resolver = useResolver(async () => {
		try {
			const content = await lesson.getContent();

			return content;
		} finally {
			onWaterfallLoadContinue?.();
		}
	}, [lesson]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const overview = isResolved(resolver) ? resolver : null;

	const items = useMemo(
		() =>
			getItems(
				overview,
				enrollmentCompletedItems,
				requiredOnly,
				incompleteOnly,
				itemInclusionFilter
			),
		[
			overview,
			enrollmentCompletedItems,
			requiredOnly,
			incompleteOnly,
			itemInclusionFilter,
		]
	);
	const hasItems = items && items.length > 0;

	const available = lesson && lesson.getAvailableBeginning();
	const ending = lesson && lesson.getAvailableEnding();

	return (
		<Loading.Placeholder loading={loading} fallback={<Placeholder />}>
			{error && <Errors.Message error={error} />}
			{hasItems && (
				<PaddedContainer className={Styles.header}>
					{available && (
						<DateTime
							className={Styles['sub-title']}
							format={dateFormat}
							date={available}
						/>
					)}
					{!available && ending && (
						<DateTime
							className={Styles['sub-title']}
							format={dateFormat}
							date={ending}
						/>
					)}
					<Text.Base className={Styles.title}>
						{overview.title}
					</Text.Base>
				</PaddedContainer>
			)}
			{hasItems && (
				<Items
					className={Styles.items}
					items={items}
					overview={overview}
					outlineNode={lesson}
					course={course}
					enrollment={enrollment}
					completedItemsOverride={enrollmentCompletedItems}
					layout={Overview.List}
					requiredOnly={requiredOnly}
					incompleteOnly={incompleteOnly}
					extraColumns={extraColumns}
				/>
			)}
		</Loading.Placeholder>
	);
}

const MonitorElement = styled('div')`
	min-height: 10vh;
`;

export default function RemainingItemsPageContainer(props) {
	const [onScreen, setOnScreen] = useState(false);
	const tripLikeIDo = useCallback(
		x => setOnScreen(onScreen || x),
		[setOnScreen, onScreen]
	);
	return !onScreen ? (
		<Monitor.OnScreen onChange={tripLikeIDo} as={MonitorElement} />
	) : (
		<RemainingItemsPage {...props} />
	);
}
