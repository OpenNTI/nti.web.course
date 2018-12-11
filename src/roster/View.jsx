import React from 'react';
import PropTypes from 'prop-types';
import {searchable, contextual} from '@nti/web-search';
import {scoped} from '@nti/lib-locale';

import Store from './Store';


const t = scoped('course.roster.View', {
	roster: 'Roster',
	empty: 'No Students',
	emptySearch: 'No Students found. Please refine your search.',
	error: 'Unable to load students.'
});

const propMap = {
	items: 'items',
	loading: 'loading',
	error: 'error',
	reload: 'reload',
	loadingNextPage: 'loadingNextPage',
	hasNextPage: 'hasNextPage',
	hasPrevPage: 'hasPrevPage',
	hasCourse: 'hasCourse'
};

export default
@contextual(t('roster'))
@searchable()
@Store.connect(propMap)
class CourseRosterView extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		renderRoster: PropTypes.func.isRequired,

		//store props
		store: PropTypes.object,
		searchTerm: PropTypes.string,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,
		reload: PropTypes.func,
		hasNextPage: PropTypes.bool,
		hasPrevPage: PropTypes.bool,
		hasCourse: PropTypes.bool
	}


	componentDidMount () {
		const {store, course} = this.props;

		store.loadCourse(course);
	}


	componentDidUpdate (prevProps) {
		const {course:nextCourse, store} = this.props;
		const {course:oldCourse} = prevProps;

		if (nextCourse !== oldCourse) {
			store.loadCourse(nextCourse);
		}
	}


	reload () {
		const {reload} = this.props;

		if (reload) {
			reload();
		}
	}


	loadNextPage = () => {
		const {hasNextPage, store} = this.props;

		if (hasNextPage) {
			store.loadNextPage();
		}
	}


	loadPrevPage = () => {
		const {hasPrevPage, store} = this.props;

		if (hasPrevPage) {
			store.loadPrevPage();
		}
	}


	getComponentProps () {
		const {items, loading, error, reload, searchTerm, hasNextPage, hasPrevPage} = this.props;

		return {
			loading,
			items,
			error,
			searchTerm,
			hasNextPage,
			hasPrevPage,
			reload,
			loadNextPage: hasNextPage && this.loadNextPage,
			loadPrevPage: hasPrevPage && this.loadPrevPage
		};
	}


	render () {
		const {hasCourse, renderRoster} = this.props;

		return hasCourse && renderRoster(this.getComponentProps());
	}
}
