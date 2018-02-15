import React from 'react';
import PropTypes from 'prop-types';
import {searchable, contextual} from 'nti-web-search';
import {scoped} from 'nti-lib-locale';

import Store from './Store';


const t = scoped('course.roster.View', {
	roster: 'Roster',
	empty: 'No Students',
	emptySearch: 'No Students found. Please refine your search.',
	error: 'Unable to load students.'
});

const store = Store.getInstance();
const propMap = {
	items: 'items',
	loading: 'loading',
	error: 'error',
	loadingNextPage: 'loadingNextPage',
	hasNextPage: 'hasNextPage',
	hasPrevPage: 'hasPrevPage',
	hasCourse: 'hasCourse'
};

export default
@contextual(t('roster'))
@searchable(store, propMap)
class CourseRosterView extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		renderRoster: PropTypes.func.isRequired,

		//store props
		searchTerm: PropTypes.string,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,
		hasNextPage: PropTypes.bool,
		hasPrevPage: PropTypes.bool,
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
		const {hasNextPage} = this.props;

		if (hasNextPage) {
			store.loadNextPage();
		}
	}


	loadPrevPage = () => {
		const {hasPrevPage} = this.props;

		if (hasPrevPage) {
			store.loadPrevPage();
		}
	}


	getComponentProps () {
		const {items, loading, error, searchTerm, hasNextPage, hasPrevPage} = this.props;

		return {
			loading,
			items,
			error,
			searchTerm,
			hasNextPage,
			hasPrevPage,
			loadNextPage: hasNextPage && this.loadNextPage,
			loadPrevPage: hasPrevPage && this.loadPrevPage
		};
	}


	render () {
		const {hasCourse, renderRoster} = this.props;

		return hasCourse && renderRoster(this.getComponentProps());
	}
}
