import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Hooks, Loading, Errors, Checkbox, EmptyState } from '@nti/web-commons';
import { Disable } from '@nti/web-routing';
import Logger from '@nti/util-logger';

import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Styles from './Style.css';
import Page from './Page';
import Tab from './Tab';

const logger = Logger.get('course:progress:remaining-items:items:View');

const { useResolver } = Hooks;
const { isPending, isResolved, isErrored } = useResolver;

const AllItems = 'all-items';
const OnlyRemaining = 'remaining-items';

const isContentOutlineNode = item =>
	item?.isOutlineNode && item?.hasOverviewContent;

const t = scoped('course.progress.remaining-items.items.View', {
	requiredOnly: 'Required Only',
	allItems: {
		zero: 'All Items',
		one: 'All Items (%(count)s)',
		other: 'All Items (%(count)s)',
	},
	remainingItems: {
		zero: 'Remaining Items',
		one: 'Remaining Items (%(count)s)',
		other: 'Remaining Items (%(count)s)',
	},
	empty: {
		requiredOnly: {
			incompleteOnly: 'There are no incomplete required items.',
			all: 'There are no required items.',
		},
		all: {
			incompleteOnly: 'There are no incomplete items.',
			all: 'There are no items.',
		},
	},
});

const getEmptyText = (requiredOnly, incompleteOnly) =>
	t(
		`empty.${requiredOnly ? 'requiredOnly' : 'all'}.${
			incompleteOnly ? 'incompleteOnly' : 'all'
		}`
	);

RemainingItems.propTypes = {
	course: PropTypes.shape({
		getContentTree: PropTypes.func,
		PreferredAccess: PropTypes.object,
	}),
	enrollment: PropTypes.shape({
		getCompletedItems: PropTypes.func,
	}),
	readOnly: PropTypes.bool,
};

export default function RemainingItems({ course, enrollment, readOnly }) {
	const [active, setActive] = React.useState(AllItems);
	const [requiredOnly, setRequiredOnly] = React.useState(true);

	const incompleteOnly = active === OnlyRemaining;

	const resolver = useResolver(async () => {
		const parent = enrollment ?? course.PreferredAccess;

		const contentWalker = (await parent.getScopedCourseInstance(course))
			.getContentTree()
			.createTreeWalker({
				skip: (...args) => !isContentOutlineNode(...args),
				ignoreChildren: isContentOutlineNode,
			});

		const nodes = await contentWalker.getNodes();
		const lessons = await Promise.all(nodes.map(n => n.getItem()));

		const summary = await parent.fetchLink(
			'UserLessonCompletionStatsByOutlineNode'
		);

		const enrollmentCompletedItems = enrollment
			? await enrollment.getCompletedItems()
			: null;

		const itemInclusionFilter = getInclusionFilter(summary);

		return {
			summary: getSummaryByLesson(summary),
			counts: getSummaryCount(summary),
			lessons,
			enrollmentCompletedItems,
			itemInclusionFilter,
		};
	}, [enrollment, course]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const {
		counts,
		enrollmentCompletedItems,
		itemInclusionFilter,
		lessons,
		summary,
	} = isResolved(resolver) ? resolver : {};

	const [loaded, dispatch] = React.useReducer(loadMoreReducer, 0);
	const next = React.useCallback(() => dispatch({ type: 'increment' }), []);
	const filteredLessons = React.useMemo(
		() =>
			getLessonsToShow(
				lessons ?? [],
				summary,
				requiredOnly,
				incompleteOnly
			),
		[lessons, summary, requiredOnly, incompleteOnly]
	);
	const lessonsToShow = filteredLessons.slice(0, loaded + 1);

	const Wrapper = readOnly ? Disable : React.Fragment;

	return (
		<Wrapper>
			<Loading.Placeholder
				loading={loading}
				fallback={<Loading.Spinner.Large />}
			>
				<div className={Styles.tabs}>
					<Tab
						label={t('allItems', { count: counts?.allItems || 0 })}
						name={AllItems}
						selected={active === AllItems}
						onSelect={setActive}
					/>
					<Tab
						label={t('remainingItems', {
							count: counts?.remainingItems || 0,
						})}
						name={OnlyRemaining}
						selected={active === OnlyRemaining}
						onSelect={setActive}
					/>
				</div>
				<PaddedContainer className={Styles.controls}>
					<Checkbox
						checked={requiredOnly}
						label={t('requiredOnly')}
						onChange={e => setRequiredOnly(e.target.checked)}
					/>
				</PaddedContainer>
				{error && <Errors.Message error={error} />}
				{lessonsToShow.length === 0 && (
					<EmptyState
						header={getEmptyText(requiredOnly, incompleteOnly)}
					/>
				)}
				<div className={Styles.pages}>
					{lessonsToShow.map((lesson, index, { length }) => {
						const isLastItem = index === length - 1;

						return (
							<Page
								key={lesson.getID()}
								lesson={lesson}
								course={course}
								enrollment={enrollment}
								enrollmentCompletedItems={
									enrollmentCompletedItems
								}
								requiredOnly={requiredOnly}
								incompleteOnly={incompleteOnly}
								itemInclusionFilter={itemInclusionFilter}
								onWaterfallLoadContinue={
									isLastItem ? next : null
								}
							/>
						);
					})}
				</div>
			</Loading.Placeholder>
		</Wrapper>
	);
}

function getLessons(o) {
	if (o.LessonNTIID) {
		return o;
	}
	if (Array.isArray(o)) {
		return o.map(getLessons);
	}

	return getLessons(Object.values(o));
}

function getSummaryByLesson(summary) {
	const { Outline } = summary;

	return Outline.reduce((acc, outline) => {
		const lessons = getLessons(outline).flat();

		for (let lesson of lessons) {
			acc[lesson.LessonNTIID] = lesson;
		}

		return acc;
	}, {});
}

function getSummaryCount(summary) {
	const { Outline } = summary;

	return Outline.reduce(
		(acc, outline) => {
			const lessons = getLessons(outline).flat();

			for (let lesson of lessons) {
				acc.allItems +=
					lesson.IncompleteCount +
					lesson.SuccessfulCount +
					lesson.UnsuccessfulCount +
					lesson.UnrequiredIncompleteCount +
					lesson.UnrequiredSuccessfulCount +
					lesson.UnrequiredUnsuccessfulCount;

				acc.remainingItems +=
					lesson.IncompleteCount +
					lesson.UnrequiredIncompleteCount +
					lesson.UnsuccessfulCount;
			}

			return acc;
		},
		{ allItems: 0, remainingItems: 0 }
	);
}

function getLessonsToShow(lessons, summary, requiredOnly, incompleteOnly) {
	return lessons.filter(lesson => {
		const lessonSummary =
			summary[lesson.getID()] ?? summary[lesson.ContentNTIID];

		const required = {
			incomplete: lessonSummary?.IncompleteCount ?? 0,
			success: lessonSummary?.SuccessfulCount ?? 0,
			failed: lessonSummary?.UnsuccessfulCount ?? 0,
		};

		const notRequired = {
			incomplete: lessonSummary?.UnrequiredIncompleteCount ?? 0,
			success: lessonSummary?.UnrequiredSuccessfulCount ?? 0,
			failed: lessonSummary?.UnrequiredUnsuccessfulCount ?? 0,
		};

		const hasRequired =
			required.incomplete + required.success + required.failed > 0;
		const hasIncomplete =
			required.incomplete + notRequired.incomplete + required.failed > 0;

		const matchesRequired = !requiredOnly || hasRequired;
		const matchesIncomplete = !incompleteOnly || hasIncomplete;

		return matchesRequired && matchesIncomplete;
	});
}

function getInclusionFilter(summary) {
	const { Assignments, Outline } = summary || {};

	const data = new Set(
		[...Outline, { assignments: [Assignments] }]
			.reduce((acc, obj) => [...acc, ...Object.values(obj).flat()], [])
			.map(statsToNTIIDs)
			.flat()
	);

	return item => {
		const target = () =>
			['Target-NTIID', 'target-NTIID', 'target-ntiid'].reduce(
				(found, x) => found || (x in item && x),
				false
			);
		const include = data.has(item.getID()) || data.has(item[target()]);
		if (!include) {
			logger.debug('Excluding item, not in summary', item);
		}
		return include;
	};
}

function statsToNTIIDs(stats) {
	return [
		...(stats.IncompleteNTIIDs || []),
		...(stats.UnrequiredIncompleteNTIIDs || []),
		...[
			...(stats.SuccessfulItems || []),
			...(stats.UnSuccessfulItems || []),
			...(stats.UnrequiredSuccessfulItems || []),
			...(stats.UnrequiredUnSuccessfulItems || []),
		].map(x => x.ItemNTIID),
	];
}

function loadMoreReducer(state, action) {
	if (action.type === 'increment') {
		return state + 1;
	}

	return state;
}
