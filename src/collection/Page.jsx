import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import {
	Loading,
	Scroll,
	Page as CommonsPage,
	Hooks,
	Layouts,
} from '@nti/web-commons';
import { Button } from '@nti/web-core';
import { WithSearch } from '@nti/web-search';

import { Store } from './Store';
import { Grid } from './components/Grid';
import { CourseCollectionGroup as Group } from './components/Group';
import { Empty } from './components/Empty';
import { ResultsLabel } from './components/ResultsLabel';

const { useMobileValue } = Hooks;

const t = scoped('course.collection.Page', {
	search: {
		AdministeredCourses: 'Administered Courses',
		EnrolledCourses: 'Enrolled Courses',
	},
	results: 'Showing Results for "%(term)s"',
	loadMore: 'Load More',
});

const Footer = styled.div`
	margin-bottom: 2rem;
	text-align: center;
`;

const LoadMore = styled(Button)`
	width: 98%;
	display: block;
	margin: 0 auto;
`;

const ControlsContainer = props => <Grid singleColumn {...props} />;
const Controls = styled(ControlsContainer)`
	margin-bottom: var(--gap, 14px);
`;

CourseCollection.propTypes = {
	collection: PropTypes.oneOfType([
		PropTypes.shape({
			title: PropTypes.string,
			getLink: PropTypes.func,
		}),
		PropTypes.oneOf(['AdministeredCourses', 'EnrolledCourses']),
	]),

	getSectionTitle: PropTypes.func,
};

function CourseCollection({ getSectionTitle, children }) {
	const {
		collection,

		loading,
		error,

		groups,
		loadMore,
		hasMore,

		onCourseDelete,
	} = Store.useValue();

	const mobile = useMobileValue(true);

	const initialLoading = loading && !error && !groups;
	const loadingMore = loading && !initialLoading;

	const empty =
		!groups?.length || groups?.every(g => g.Items && g.Items.length === 0);

	const scrollerRef = React.useRef();

	// The "load more" button is only here as a fallback for cases where <Scroll.BoundaryMonitor> events
	// aren't working. This is a mythological occurrence--we've heard tales of it but have never actually
	// seen it. To avoid having the button flicker in and out--appearing during render and disappearing again
	// when the next load is triggered--this reducer (along with a dispatch in the onBottom handler below)
	// keeps track of whether the component has received any boundary monitor events. Once it has we assume
	// it's safe to not show the load more button.
	const [{ showLoadMoreButton }, dispatch] = React.useReducer(
		(state, action) => {
			const updated = { ...state, ...action };
			return {
				...updated,
				showLoadMoreButton:
					!loading &&
					hasMore &&
					updated.canScroll &&
					!updated.receivingBoundaryEvents,
			};
		},
		{}
	);

	const onBoundaryBottom = !hasMore
		? null
		: () => {
				dispatch({ receivingBoundaryEvents: true }); // note that we're receiving these events and don't need to show the 'load more' button.
				loadMore();
		  };

	React.useEffect(() => {
		if (loading) {
			return;
		}

		const timeout = setTimeout(() => {
			if (!scrollerRef.current) {
				return;
			}

			const canScroll = scrollerRef.current.canScroll();

			dispatch({ canScroll });

			if (!canScroll && hasMore) {
				loadMore();
			}
		}, 100);

		return () => clearTimeout(timeout);
	}, [loading, hasMore, loadMore]);

	return (
		<Scroll.BoundaryMonitor
			ref={scrollerRef}
			window
			buffer={200}
			onBottom={onBoundaryBottom}
		>
			<CommonsPage>
				<CommonsPage.Content card={false}>
					<ResultsLabel empty={empty} />
					<Loading.Placeholder
						loading={initialLoading}
						fallback={<CommonsPage.Content.Loading />}
					>
						{error && <CommonsPage.Content.Error error={error} />}
						{!error && empty && (
							<Empty collection={collection} searchTerm />
						)}
						{!error &&
							!empty &&
							Layouts.Slot.exists('controls', children) && (
								<Controls>
									<Layouts.Slot
										slot="controls"
										{...{ children }}
									/>
								</Controls>
							)}
						{(groups ?? []).map(group => (
							<Group
								key={group.name}
								group={group}
								mobile={mobile}
								getSectionTitle={getSectionTitle}
								onCourseDelete={onCourseDelete}
							/>
						))}
						<Footer>
							{loadingMore && <Loading.Spinner />}
							{showLoadMoreButton && (
								<LoadMore rounded onClick={loadMore}>
									{t('loadMore')}
								</LoadMore>
							)}
						</Footer>
					</Loading.Placeholder>
				</CommonsPage.Content>
			</CommonsPage>
		</Scroll.BoundaryMonitor>
	);
}

const Connected = Store.compose(CourseCollection, {
	deriveBindingFromProps: ({ collection, sortOn, sortOrder }) => ({
		collection,
		sortOn,
		sortOrder: sortOrder || Store.defaultSortOrder(sortOn),
	}),
});

const title = collection =>
	typeof collection === 'string' ? collection : collection?.Title;

export const Page = WithSearch(Connected, {
	context: ({ collection }) => title(collection),
	label: ({ collection }) => t(`search.${title(collection)}`),
});
