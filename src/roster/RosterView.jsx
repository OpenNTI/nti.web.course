import React from 'react';
import PropTypes from 'prop-types';
import {searchable, contextual} from '@nti/web-search';
import {scoped} from '@nti/lib-locale';
import {SortOrder} from '@nti/lib-interfaces';

import Roster from './Roster';
import Store from './Store';
import {parametersFromLink, decodeBatchLink} from './util/batch-link-encoding';


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
	hasCourse: 'hasCourse',
	options: 'options',
	batchLinkFor: 'batchLinkFor'
};

export default
@contextual(t('roster'))
@searchable()
@Store.connect(propMap)
class CourseRosterView extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		encodedBatchLink: PropTypes.string,
		renderRoster: PropTypes.func,
		children: PropTypes.any,

		//store props
		store: PropTypes.object,
		searchTerm: PropTypes.string,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.any,
		reload: PropTypes.func,
		hasNextPage: PropTypes.bool,
		hasPrevPage: PropTypes.bool,
		hasCourse: PropTypes.bool,
		options: PropTypes.object,
		batchLinkFor: PropTypes.func.isRequired
	}


	componentDidMount () {
		const {course} = this.props;

		this.loadCourse(course);
	}


	componentDidUpdate (prevProps) {
		const {course: nextCourse} = this.props;
		const {course: oldCourse} = prevProps;

		if (nextCourse !== oldCourse) {
			this.loadCourse(nextCourse);
		}
	}

	loadCourse = course => {
		const {store, encodedBatchLink} = this.props;
		let options;

		if (encodedBatchLink) {
			try {
				options = parametersFromLink(decodeBatchLink(encodedBatchLink));
			}
			catch (e) {
				//
			}
		}

		store.loadCourse(course, options);
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

	setSort = (sortOn, sortDir) => {
		const {store, store: {sortedOn, sortedOrder = SortOrder.ASC}} = this.props;

		const sortOrder = sortDir || (
			sortedOn === sortOn
				? sortedOrder === SortOrder.ASC
					? SortOrder.DESC
					: SortOrder.ASC
				: SortOrder.ASC
		);

		store.addOptions({
			sortOn,
			sortOrder
		});
	}


	getComponentProps = () => {
		const {
			children,
			course,
			items,
			loading,
			error,
			reload,
			searchTerm,
			hasNextPage,
			hasPrevPage,
			options: {
				sortOn: sortedOn,
				sortOrder: sortedOrder
			} = {},
			batchLinkFor
		} = this.props;

		return {
			children,
			course,
			loading,
			items,
			error,
			searchTerm,
			hasNextPage,
			hasPrevPage,
			reload,
			loadNextPage: hasNextPage ? this.loadNextPage : null,
			loadPrevPage: hasPrevPage ? this.loadPrevPage : null,
			setSort: this.setSort,
			sortedOn,
			sortedOrder,
			batchLinkFor
		};
	}

	renderTable = props => <Roster {...props} />

	render () {
		const {hasCourse, renderRoster = this.renderTable} = this.props;

		return hasCourse && renderRoster(this.getComponentProps());
	}
}
