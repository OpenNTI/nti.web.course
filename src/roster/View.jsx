import React from 'react';
import PropTypes from 'prop-types';
import {searchable, contextual} from 'nti-web-search';
import {scoped} from 'nti-lib-locale';

import Store from './Store';

const DEFAULT_TEXT = {
	roster: 'Roster',
	empty: 'No Students',
	emptySearch: 'No Students found. Please refine your search.',
	error: 'Unable to load students.'
};
const t = scoped('nti-web-course.roster', DEFAULT_TEXT);

const store = Store.getInstance();
const propMap = {
	items: 'items',
	loading: 'loading',
	error: 'error',
	loadingNextPage: 'loadingNextPage',
	hasNextPage: 'hasNextPage',
	hasCourse: 'hasCourse'
};

@contextual(t('roster'))
@searchable(store, propMap)
export default class CourseRosterView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		course: PropTypes.object,
		renderItems: PropTypes.func.isRequired,
		renderHeader: PropTypes.func,
		renderFooter: PropTypes.func,

		store: PropTypes.object,
		searchTerm: PropTypes.string,

		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,

		loadingNextPage: PropTypes.bool,
		hasNextPage: PropTypes.bool,

		hasCourse: PropTypes.bool
	}


	componentDidMount () {
		const {course} = this.props;

		store.loadCourse(course);
	}


	componentWillReceiveProps (nextProps) {
		const {course:nextCourse} = nextProps;
		const {course:oldCourse} = this.props;

		if (nextCourse !== oldCourse) {
			store.loadCourse(nextCourse);
		}
	}


	loadNextPage = () => {
		const {loadingNextPage, hasNextPage} = this.props;

		if (!loadingNextPage && hasNextPage) {
			store.loadNextPage();
		}
	}


	getComponentProps () {
		const {items, loading, error, searchTerm, loadingNextPage, hasNextPage} = this.props;

		return {
			loading,
			items,
			error,
			searchTerm,
			loadingNextPage,
			loadNextPage: hasNextPage && this.loadNextPage
		};
	}


	render () {
		const {className, hasCourse} = this.props;

		return (
			<div className={className}>
				{hasCourse && this.renderHeader()}
				{hasCourse && this.renderItems()}
				{hasCourse && this.renderFooter()}
			</div>
		);
	}


	renderHeader () {
		const {renderHeader} = this.props;

		return renderHeader ? renderHeader(this.getComponentProps()) : null;
	}


	renderItems () {
		const {renderItems} = this.props;

		return renderItems(this.getComponentProps());
	}


	renderFooter () {
		const {renderFooter} = this.props;

		return renderFooter ? renderFooter(this.getComponentProps()) : null;
	}
}
