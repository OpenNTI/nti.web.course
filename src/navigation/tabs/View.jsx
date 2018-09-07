import React from 'react';
import PropTypes from 'prop-types';

import RouteCache from './RouteCache';
import Store from './Store';

export default
@Store.connect(['tabs'])
class CourseTabs extends React.Component {
	static deriveBindingFromProps (props) {
		return props.course;
	}

	static propTypes = {
		course: PropTypes.object,
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				id: PropTypes.string,
				hide: PropTypes.bool
			})
		)
	}

	static contextTypes = {
		router: PropTypes.object
	}

	get router () {
		return this.context.router;
	}


	get baseRoute () {
		if (!this.router) {
			return '';
		}

		return this.router.baseroute;
	}

	get activeRoute () {
		if (!this.router) {
			return '';
		}

		return this.router.route.location.pathname;
	}


	getRouteForTab (tabID) {
		if (!this.router) {
			return '';
		}

		const {course} = this.props;

		return this.router.getRouteFor(course, tabID);
	}

	render () {
		const {tabs} = this.props;

		if (!tabs) { return null; }

		return (
			<div>
				{tabs.map(tab => this.renderTab(tab))}
			</div>
		);
	}

	renderTab (tab) {
		const {baseRoute, activeRoute} = this;
		const {id, isRootRoute} = tab;
		const tabRoot = this.getRouteForTab(id);

		const isActive = activeRoute.indexOf(tabRoot) === 0 || (isRootRoute && activeRoute === baseRoute);

		let route = null;

		if (isActive) {
			RouteCache.set(tabRoot, activeRoute);
			route = tabRoot;
		} else {
			route = RouteCache.get(tabRoot);
		}

		return (
			<div>
				{`${route} ${isActive ? 'active' : ''}`}
			</div>
		);
	}
}
