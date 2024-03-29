import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Loading, Input, EmptyState } from '@nti/web-commons';

import Store from './Store';
import ListItem from './ListItem';

const t = scoped('course.selector', {
	error: 'Unable to load courses.',
	errorLoadingMore: 'Unable to load more courses.',
	searchPlaceholder: 'Search',
	empty: 'There are no courses.',
	search: {
		empty: 'There are no courses. Please update your query.',
	},
	loadMore: 'Load More',
});

class CourseSelector extends React.Component {
	static deriveBindingFromProps(props) {
		return props.collection || 'catalog';
	}

	static propTypes = {
		collection: PropTypes.oneOf(['catalog', 'AdministeredCourses']),
		selected: PropTypes.array,
		onSelect: PropTypes.func,

		loading: PropTypes.bool,
		error: PropTypes.any,
		courses: PropTypes.array,

		hasMore: PropTypes.bool,
		loadMore: PropTypes.func,
		loadingMore: PropTypes.bool,
		errorLoadingMore: PropTypes.any,

		searchTerm: PropTypes.string,
		updateSearchTerm: PropTypes.func,
	};

	static defaultProps = {
		collection: 'catalog',
	};

	isSelected(course) {
		const { selected } = this.props;

		if (!selected || !selected.length) {
			return;
		}

		return (
			selected.map(c => c === course || course.getID() === c).length > 0
		);
	}

	loadMore = () => {
		const { loadMore } = this.props;

		if (loadMore) {
			loadMore();
		}
	};

	onSelect = course => {
		const { onSelect } = this.props;

		if (onSelect) {
			onSelect(course);
		}
	};

	onSearchChange = value => {
		const { updateSearchTerm } = this.props;

		if (updateSearchTerm) {
			updateSearchTerm(value);
		}
	};

	render() {
		const { loading, error } = this.props;

		return (
			<div className="nti-course-selector">
				{this.renderSearch()}
				{loading && <Loading.Mask />}
				{!loading && error && this.renderError()}
				{!loading && !error && this.renderCourses()}
			</div>
		);
	}

	renderSearch() {
		const { searchTerm } = this.props;

		return (
			<div className="search">
				<div className="input">
					<Input.Text
						value={searchTerm || ''}
						placeholder={t('searchPlaceholder')}
						onChange={this.onSearchChange}
					/>
					<i className="icon-search" />
				</div>
			</div>
		);
	}

	renderError() {
		return <span className="error">{t('error')}</span>;
	}

	renderCourses() {
		const { courses, hasMore, loadingMore, errorLoadingMore } = this.props;

		if (!courses || !courses.length) {
			return this.renderEmpty();
		}

		return (
			<div className="courses">
				<ul>
					{courses.map((course, ix) => {
						return (
							<li key={ix}>
								<ListItem
									course={course}
									onSelect={this.onSelect}
									selected={this.isSelected(course)}
								/>
							</li>
						);
					})}
				</ul>
				{(hasMore || loadingMore) && !errorLoadingMore && (
					<div
						className={cx('load-more', { loading: loadingMore })}
						onClick={this.loadMore}
					>
						{loadingMore ? (
							<Loading.Spinner white />
						) : (
							t('loadMore')
						)}
					</div>
				)}
				{errorLoadingMore && (
					<span className="error">{t('errorLoadingMore')}</span>
				)}
			</div>
		);
	}

	renderEmpty() {
		const { searchTerm } = this.props;

		return (
			<EmptyState header={searchTerm ? t('search.empty') : t('empty')} />
		);
	}
}

export default decorate(CourseSelector, [
	Store.connect([
		'courses',
		'loading',
		'error',
		'searchTerm',
		'updateSearchTerm',
		'hasMore',
		'loadingMore',
		'loadMore',
		'errorLoadingMore',
	]),
]);
