import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import {
	Loading,
	Scroll,
	Page as CommonsPage,
	Hooks,
	Button,
	Layouts,
} from '@nti/web-commons';
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

	React.useEffect(() => {
		if (loading) {
			return;
		}

		const timeout = setTimeout(() => {
			if (!scrollerRef.current) {
				return;
			}

			if (!scrollerRef.current.canScroll() && hasMore) {
				loadMore();
			}
		}, 100);

		return () => clearTimeout(timeout);
	}, [loading, hasMore, loadMore]);

	return (
		<Scroll.BoundaryMonitor
			ref={scrollerRef}
			window
			onBottom={hasMore ? loadMore : null}
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
							{!loadingMore && hasMore && (
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
	deriveBindingFromProps: ({ collection, sortOn, sortDirection }) => ({
		collection,
		sortOn,
		sortDirection:
			sortDirection || Store.defaultSortDirection(collection, sortOn),
	}),
});

const title = collection =>
	typeof collection === 'string' ? collection : collection?.Title;

export const Page = WithSearch(Connected, {
	context: ({ collection }) => title(collection),
	label: ({ collection }) => t(`search.${title(collection)}`),
});
