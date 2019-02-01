import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading, Scroll, Table as T} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import columnsFor from './columns';
import Header from './Header';
import Toolbar from './Toolbar';
import styles from './Roster.css';

const t = scoped('course.roster.component', {
	emptyMessage: 'No enrollees found'
});

const cx = classnames.bind(styles);

export default class Roster extends React.Component {

	static propTypes = {
		course: PropTypes.object,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,
		hasCourse: PropTypes.bool,
		loadNextPage: PropTypes.func,
		setSort: PropTypes.func,
		sortedOn: PropTypes.string,
		sortedOrder: PropTypes.string,
		canScroll: PropTypes.func
	}

	onUpdate = (canScroll) => {
		if (canScroll === false) {
			this.loadMore();
		}
	}

	loadMore = () => {
		const {loadNextPage, loading} = this.props;
		
		if (!loading && loadNextPage) {
			loadNextPage();
		}
	}

	onScrolledBottom = () => {
		this.loadMore();
	}

	render () {
		const {items, loading, course, setSort, sortedOn: sortOn, sortedOrder: sortDirection} = this.props;
		const empty = !loading && !(items && items.length);
		const columns = columnsFor(course);

		return (
			<Scroll.BoundaryMonitor window onBottom={this.onScrolledBottom} onUpdate={this.onUpdate}>
				<section className={cx('course-roster')}>
					<Header />
					<Toolbar course={course} />
					<div className={cx('content', {empty, loading})}>
						<T.Table className={cx('table')} columns={columns} items={items || []} onSortChange={setSort} sortOn={sortOn} sortDirection={sortDirection} />
						{loading && <Loading.Spinner />}
						{empty && (
							<div className={cx('empty-message')}>{t('emptyMessage')}</div>
						)}
					</div>
				</section>
			</Scroll.BoundaryMonitor>
		);
	}
}
