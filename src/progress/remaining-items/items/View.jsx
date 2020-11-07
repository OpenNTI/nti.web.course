import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Hooks, Loading, Errors, Checkbox, EmptyState} from '@nti/web-commons';

import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Styles from './Style.css';
import Page from './Page';

const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const isContentOutlineNode = (item) => item?.isOutlineNode && item?.hasOverviewContent;

const t = scoped('course.progress.remaining-items.items.View', {
	requiredOnly: 'Required Only',
	incompleteOnly: 'Incomplete Only',
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

function getSummaryByLesson (summary) {
	const {Outline} = summary;

	const getLessons = (o) => {
		if (o.LessonNTIID) { return o;}
		if (Array.isArray(o)) { return o.map(getLessons); }

		return getLessons(Object.values(o));
	};

	return Outline.reduce((acc, outline) => {
		const lessons = getLessons(outline).flat();

		for (let lesson of lessons) {
			acc[lesson.LessonNTIID] = lesson;
		}

		return acc;
	}, {});
}

function getLessonsToShow (lessons, summary, requiredOnly, incompleteOnly) {
	return lessons.filter((lesson) => {
		const lessonSummary = summary[lesson.getID()] ?? summary[lesson.ContentNTIID];
		const {
			IncompleteCount: incomplete,
			SuccessfulCount: success,
			UnsuccessfulCount: failed
		} = lessonSummary;

		const matchesRequired = !requiredOnly || (incomplete + success + failed) > 0;
		const matchesIncomplete = !incompleteOnly || (incomplete);

		return matchesRequired && matchesIncomplete;
	});
}


RemainingItems.propTypes = {
	course: PropTypes.shape({
		getContentTree: PropTypes.func,
		PreferredAccess: PropTypes.object
	})
};
export default function RemainingItems ({course}) {
	const [requiredOnly, setRequiredOnly] = React.useState(true);
	const [incompleteOnly, setIncompleteOnly] = React.useState(true);

	const resolver = useResolver(async () => {
		const contentWalker = course
			.getContentTree()
			.createTreeWalker({
				skip: (...args) => !isContentOutlineNode(...args),
				ignoreChildren: isContentOutlineNode
			});

		const nodes = await contentWalker.getNodes();
		const lessons = await Promise.all(nodes.map(n => n.getItem()));

		const summary = await course.PreferredAccess.fetchLink('UserLessonCompletionStatsByOutlineNode');

		return {
			summary: getSummaryByLesson(summary),
			lessons
		};
	}, [course]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const {lessons, summary} = isResolved(resolver) ? resolver : {};

	const [toShow, setToShow] = React.useState(0);
	const lessonsToShow = getLessonsToShow(lessons ?? [], summary, requiredOnly, incompleteOnly).slice(0, toShow + 1);

	return (
		<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
			<PaddedContainer className={Styles.controls}>
				<Checkbox checked={requiredOnly} label={t('requiredOnly')} onChange={e => setRequiredOnly(e.target.checked)} />
				<Checkbox checked={incompleteOnly} label={t('incompleteOnly')} onChange={e => setIncompleteOnly(e.target.checked)} />
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
							requiredOnly={requiredOnly}
							incompleteOnly={incompleteOnly}

							onLoad={toLoad}
						/>
					);
				})}
			</div>
		</Loading.Placeholder>
	);
}
