import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Scroll, Page, Hooks} from '@nti/web-commons';

import Store from './Store';
import Group from './components/Group';
import Empty from './components/Empty';

const {useMobileValue} = Hooks;

CourseCollection.propTypes = {
	collection: PropTypes.shape({
		title: PropTypes.string,
		getLink: PropTypes.func
	}),

	getSectionTitle: PropTypes.func
};
function CourseCollection ({getSectionTitle}) {
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

	const empty = groups && groups.length === 0;

	const scrollerRef = React.useRef();

	React.useEffect(() => {
		if (loading) { return; }

		const timeout = setTimeout(() => {
			if (!scrollerRef.current) { return; }

			if (!scrollerRef.current.canScroll() && hasMore) {
				loadMore();
			}
		}, 100);

		return () => clearTimeout(timeout);
	}, [loading, hasMore, loadMore]);

	return (
		<Scroll.BoundaryMonitor ref={scrollerRef} window onBottom={hasMore ? loadMore : null}>
			<Page>
				<Page.Content card={false}>
					<Loading.Placeholder loading={initialLoading} fallback={<Page.Content.Loading />}>
						{error && (<Page.Content.Error error={error} />)}
						{!error && empty && (<Empty collection={collection} />)}
						{(groups ?? []).map((group) => (
							<Group key={group.name} group={group} mobile={mobile} getSectionTitle={getSectionTitle} onCourseDelete={onCourseDelete} />
						))}
						{loadingMore && (<Loading.Spinner />)}
					</Loading.Placeholder>
				</Page.Content>
			</Page>
		</Scroll.BoundaryMonitor>
	);
}

export default Store.compose(CourseCollection, {
	deriveBindingFromProps: ({collection}) => ({collection})
});
