import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading, Scroll, Table as T} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import Logger from '@nti/util-logger';

import {encodeBatchLink} from './util';
import columnsFor from './columns';
import Header from './Header';
import Toolbar from './Toolbar';
import styles from './Roster.css';

const logger = Logger.get('course.roster.component');

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
		canScroll: PropTypes.func,
		batchLinkFor: PropTypes.func.isRequired,
		summary: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.shape({
			routeTo: PropTypes.shape({
				object: PropTypes.func
			}).isRequired
		}).isRequired
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

	onRowClick = (item, event) => {
		const {
			props: {batchLinkFor},
			context: {router} = {}
		} = this;

		if (batchLinkFor && router && router.routeTo && router.routeTo.path) {
			const batchLink = batchLinkFor(item);

			if (batchLink) {
				const subroute = `./progress/${encodeBatchLink(batchLink)}`;
				const path = join(router.baseroute || '', subroute);
				router.routeTo.path(path);
			}
		}
		else {
			logger.warn('Unable to route to student progress. Ignoring row click.');
		}
	}

	closeDialog = () => {
		const {
			context: {router} = {}
		} = this;

		if (router && router.routeTo && router.routeTo.path) {
			router.routeTo.path('/');
		}
		else {
			global.history.go(-1);
		}
	}

	render () {
		const {
			items,
			summary: {
				TotalEnrollmentsByScope: scopes = {},
				TotalEnrollments: total = 0
			} = {},
			loading,
			course,
			setSort,
			sortedOn: sortOn,
			sortedOrder: sortDirection,
			children
		} = this.props;
		const empty = !loading && !(items && items.length);
		const columns = columnsFor(course);
		const onRowClick = (course || {}).CompletionPolicy ? this.onRowClick : null;
		const showHeader = !empty
			&& total > 1 // more than one student
			&& Object.values(scopes)
				.filter(v => v > 0)
				.length > 1; // more than one non-empty scope

		return (
			<Scroll.BoundaryMonitor window onBottom={this.onScrolledBottom} onUpdate={this.onUpdate}>
				<section className={cx('course-roster')}>
					{showHeader && <Header />}
					<Toolbar course={course} />
					<div className={cx('content', {empty, loading})}>
						<T.Table
							className={cx('table')}
							columns={columns}
							items={items || []}
							onSortChange={setSort}
							sortOn={sortOn}
							sortDirection={sortDirection}
							onRowClick={onRowClick}
						/>
						{loading && <Loading.Spinner />}
						{empty && (
							<div className={cx('empty-message')}>{t('emptyMessage')}</div>
						)}
						{children}
					</div>
				</section>
			</Scroll.BoundaryMonitor>
		);
	}
}
