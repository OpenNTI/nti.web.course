import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Hooks, Loading, Errors, Checkbox} from '@nti/web-commons';

import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Styles from './Style.css';
import Page from './Page';

const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const isContentOutlineNode = (item) => item?.isOutlineNode && item?.hasOverviewContent;

const t = scoped('course.progress.remaining-items.items.View', {
	requiredOnly: 'Only Required',
	incompleteOnly: 'Only Incomplete'
});


RemainingItems.propTypes = {
	course: PropTypes.shape({
		getContentTree: PropTypes.func
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
			<PaddedContainer className={Styles.controls}>
				<Checkbox checked={requiredOnly} label={t('requiredOnly')} onChange={e => setRequiredOnly(e.target.checked)} />
				<Checkbox checked={incompleteOnly} label={t('incompleteOnly')} onChange={e => setIncompleteOnly(e.target.checked)} />
			</PaddedContainer>
			{error && (<Errors.Message error={error} />)}
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
