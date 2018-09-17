import React from 'react';
import PropTypes from 'prop-types';
import {Navigation} from '@nti/web-commons';

import RouteCache from './RouteCache';
import Store from './Store';

function isSameRoute (a, b) {
	const trim = route => route.replace(/\/$/, '');

	return trim(a) === trim(b);
}

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
		),
		exclude: PropTypes.arrayOf(
			PropTypes.string
		),
		expandTabs: PropTypes.bool
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
		const {tabs, exclude, expandTabs} = this.props;

		if (!tabs) { return null; }

		let visibleTabs = tabs;

		if (exclude) {
			visibleTabs = visibleTabs.filter(tab => exclude.indexOf(tab.id) === -1);
		}


		return (
			<Navigation.Tabs expandTabs={expandTabs}>
				{visibleTabs.map(tab => this.renderTab(tab))}
			</Navigation.Tabs>
		);
	}

	renderTab (tab) {
		const {baseRoute, activeRoute} = this;
		const {id, label, isRootRoute} = tab;
		const tabRoot = this.getRouteForTab(id);

		const isActive = isSameRoute(activeRoute, tabRoot) || activeRoute.indexOf(tabRoot) === 0 || (isRootRoute && isSameRoute(activeRoute, baseRoute));

		let route = null;

		if (isActive) {
			RouteCache.set(tabRoot, activeRoute);
			route = tabRoot;
		} else {
			route = RouteCache.get(tabRoot);
		}

		return (
			<Navigation.Tabs.Tab
				key={id}
				route={route}
				label={label}
				active={isActive}
			/>
		);
	}
}
