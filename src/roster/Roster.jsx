import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading, Table as T} from '@nti/web-commons';

import columnsFor from './columns';
import styles from './Roster.css';

const cx = classnames.bind(styles);

export default class Roster extends React.Component {

	static propTypes = {
		course: PropTypes.object,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,
		reload: PropTypes.func,
		hasNextPage: PropTypes.bool,
		hasPrevPage: PropTypes.bool,
		hasCourse: PropTypes.bool,
		loadNextPage: PropTypes.func,
		loadPrevPage: PropTypes.func
	}

	render () {
		const {items, loading, course} = this.props;
		const isEmpty = !(items && items.length);
		const columns = columnsFor(course);

		return (
			<section className={cx('course-roster')}>
				{
					loading
						? <Loading.Spinner />
						: (
							<>
								<header>
									
								</header>
								<div className={cx('content')}>
									<T.Table className={cx('table')} columns={columns} items={items} />
								</div>
							</>
						)
				}
			</section>
		);
	}
}
