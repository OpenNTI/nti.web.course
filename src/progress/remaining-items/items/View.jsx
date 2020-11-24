import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Hooks, Loading, Errors, Checkbox, EmptyState} from '@nti/web-commons';
import {Disable} from '@nti/web-routing';

import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Styles from './Style.css';
import Page from './Page';
import Tab from './Tab';

const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const AllItems = 'all-items';
const OnlyRemaining = 'remaining-items';

const isContentOutlineNode = (item) => item?.isOutlineNode && item?.hasOverviewContent;

const t = scoped('course.progress.remaining-items.items.View', {
	requiredOnly: 'Required Only',
	allItems: 'All Items (%(items)s)',
	remainingItems: 'Remaining Items (%(items)s)',
	empty: {
		requiredOnly: {
			incompleteOnly: 'There are no incomplete required items.',
			all: 'There are no required items.'
		},
		all: {
			incompleteOnly: 'There are no incomplete items.',
			all: 'There are no items.'
		}
	}
});

const getEmptyText = (requiredOnly, incompleteOnly) => t(`empty.${requiredOnly ? 'requiredOnly' : 'all'}.${incompleteOnly ? 'incompleteOnly' : 'all'}`);

const getLessons = (o) => {
	if (o.LessonNTIID) { return o; }
	if (Array.isArray(o)) { return o.map(getLessons); }

	return getLessons(Object.values(o));
};

function getSummaryByLesson (summary) {
	const {Outline} = summary;

	return Outline.reduce((acc, outline) => {
		const lessons = getLessons(outline).flat();

		for (let lesson of lessons) {
			acc[lesson.LessonNTIID] = lesson;
		}

		return acc;
	}, {});
}

function getSummaryCount (summary) {
	const {Outline} = summary;

	return Outline.reduce((acc, outline) => {
		const lessons = getLessons(outline).flat();

		for (let lesson of lessons) {
			acc.allItems += lesson.IncompleteCount +
				lesson.SuccessfulCount +
				lesson.UnsuccessfulCount +
				lesson.UnrequiredIncompleteCount +
				lesson.UnrequiredSuccessfulCount +
				lesson.UnrequiredUnsuccessfulCount;

			acc.remainingItems += lesson.IncompleteCount + lesson.UnrequiredIncompleteCount;
		}

		return acc;
	}, {allItems: 0, remainingItems: 0});
}

function getLessonsToShow (lessons, summary, requiredOnly, incompleteOnly) {
	return lessons.filter((lesson) => {
		const lessonSummary = summary[lesson.getID()] ?? summary[lesson.ContentNTIID];

		const required = {
			incomplete: lessonSummary?.IncompleteCount ?? 0,
			success: lessonSummary?.SuccessfulCount ?? 0,
			failed: lessonSummary?.UnsuccessfulCount ?? 0
		};

		const notRequired = {
			incomplete: lessonSummary?.UnrequiredIncompleteCount ?? 0,
			success: lessonSummary?.UnrequiredSuccessfulCount ?? 0,
			failed: lessonSummary?.UnrequiredUnsuccessfulCount ?? 0
		};

		const hasRequired = (required.incomplete + required.success + required.failed) > 0;
		const hasIncomplete = (required.incomplete + notRequired.incomplete) > 0;

		const matchesRequired = !requiredOnly || hasRequired;
		const matchesIncomplete = !incompleteOnly || hasIncomplete;

		return matchesRequired && matchesIncomplete;
	});
}



RemainingItems.propTypes = {
	course: PropTypes.shape({
		getContentTree: PropTypes.func,
		PreferredAccess: PropTypes.object
	}),
	enrollment: PropTypes.shape({
		getCompletedItems: PropTypes.func
	}),
	readOnly: PropTypes.bool
};
export default function RemainingItems ({course, enrollment, readOnly}) {
	const [active, setActive] = React.useState(AllItems);
	const [requiredOnly, setRequiredOnly] = React.useState(true);

	const incompleteOnly = active === OnlyRemaining;


	const resolver = useResolver(async () => {
		const contentWalker = course
			.getContentTree()
			.createTreeWalker({
				skip: (...args) => !isContentOutlineNode(...args),
				ignoreChildren: isContentOutlineNode
			});

		const nodes = await contentWalker.getNodes();
		const lessons = await Promise.all(nodes.map(n => n.getItem()));

		const parent = enrollment ?? course.PreferredAccess;
		const summary = await parent.fetchLink('UserLessonCompletionStatsByOutlineNode');

		const enrollmentCompletedItems = enrollment ? await enrollment.getCompletedItems() : null;

		return {
			summary: getSummaryByLesson(summary),
			counts: getSummaryCount(summary),
			lessons,
			enrollmentCompletedItems
		};
	}, [course]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const {lessons, summary, counts, enrollmentCompletedItems} = isResolved(resolver) ? resolver : {};

	const [toShow, setToShow] = React.useState(0);
	const filteredLessons = React.useMemo(
		() => getLessonsToShow(lessons ?? [], summary, requiredOnly, incompleteOnly),
		[lessons, summary, requiredOnly, incompleteOnly]
	);
	const lessonsToShow = filteredLessons.slice(0, toShow + 1);

	const Wrapper = readOnly ? Disable : React.Fragment;

	return (
		<Wrapper>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				<div className={Styles.tabs}>
					<Tab
						label={t('allItems', {items: counts?.allItems ?? ''})}
						name={AllItems}
						selected={active === AllItems}
						onSelect={setActive}
					/>
					<Tab
						label={t('remainingItems', {items: counts?.remainingItems ?? ''})}
						name={OnlyRemaining}
						selected={active === OnlyRemaining}
						onSelect={setActive}
					/>
				</div>
				<PaddedContainer className={Styles.controls}>
					<Checkbox checked={requiredOnly} label={t('requiredOnly')} onChange={e => setRequiredOnly(e.target.checked)} />
				</PaddedContainer>
				{error && (<Errors.Message error={error} />)}
				{lessonsToShow.length === 0 && (
					<EmptyState header={getEmptyText(requiredOnly, incompleteOnly)} />
				)}
				<div className={Styles.pages}>
					{lessonsToShow.map((lesson, index) => {
						const toLoad = index === toShow ? () => setToShow(index + 1) : null;

						return (
							<Page
								key={lesson.getID()}
								lesson={lesson}
								course={course}
								enrollment={enrollment}
								enrollmentCompletedItems={enrollmentCompletedItems}
								requiredOnly={requiredOnly}
								incompleteOnly={incompleteOnly}

								onLoad={toLoad}
							/>
						);
					})}
				</div>
			</Loading.Placeholder>
		</Wrapper>
	);
}
