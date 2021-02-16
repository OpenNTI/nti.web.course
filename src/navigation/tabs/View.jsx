import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { Navigation } from '@nti/web-commons';

import RouteCache from './RouteCache';
import Store from './Store';

function isSameRoute(a, b) {
	const trim = route => route.replace(/\/$/, '');

	return trim(a) === trim(b);
}

function isRouteActive(route, activeRoute) {
	return isSameRoute(route, activeRoute) || activeRoute.indexOf(route) === 0;
}

class CourseTabs extends React.Component {
	static deriveBindingFromProps(props) {
		return props.course;
	}

	static propTypes = {
		course: PropTypes.object,
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				id: PropTypes.string,
				hide: PropTypes.bool,
				isRootRoute: PropTypes.bool,
				subRoutes: PropTypes.arrayOf(PropTypes.string),
			})
		),
		exclude: PropTypes.arrayOf(PropTypes.string),
		expandTabs: PropTypes.bool,
		shadowRoots: PropTypes.object,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	get router() {
		return this.context.router;
	}

	get baseRoute() {
		if (!this.router) {
			return '';
		}

		return this.router.baseroute;
	}

	get activeRoute() {
		if (!this.router) {
			return '';
		}

		return global.location.pathname;
	}

	getRouteForTab(tabID) {
		if (!this.router) {
			return '';
		}

		const { course } = this.props;

		return this.router.getRouteFor(course, tabID);
	}

	getShadowRootForTab(tabID) {
		const { shadowRoots } = this.props;
		const { activeRoute } = this;

		const shadowRoot = shadowRoots && shadowRoots[tabID];

		return shadowRoot && !isSameRoute(shadowRoot, activeRoute)
			? shadowRoot
			: null;
	}

	render() {
		const { tabs, exclude, expandTabs } = this.props;

		if (!tabs) {
			return null;
		}

		let visibleTabs = tabs;

		if (exclude) {
			visibleTabs = visibleTabs.filter(
				tab => exclude.indexOf(tab.id) === -1
			);
		}

		return (
			<Navigation.Tabs expandTabs={expandTabs}>
				{visibleTabs.map(tab => this.renderTab(tab))}
			</Navigation.Tabs>
		);
	}

	renderTab(tab) {
		const { baseRoute, activeRoute } = this;
		const { id, label, subRoutes, isRootRoute } = tab;
		const tabRoot = this.getRouteForTab(id);
		const shadowRoot = this.getShadowRootForTab(id);
		const practicalRoot = shadowRoot || tabRoot;

		const isActive =
			isRouteActive(tabRoot, activeRoute) ||
			(isRootRoute && isSameRoute(activeRoute, baseRoute));
		const isSubActive =
			(subRoutes || []).filter(subRoute =>
				isRouteActive(this.getRouteForTab(subRoute), activeRoute)
			).length > 0;

		let route = null;

		if (isActive || isSubActive) {
			RouteCache.set(tabRoot, activeRoute);
			route = practicalRoot;
		} else {
			route = RouteCache.get(tabRoot);
		}

		return (
			<Navigation.Tabs.Tab
				key={id}
				route={route}
				label={label}
				active={isActive || isSubActive}
			/>
		);
	}
}

export default decorate(CourseTabs, [Store.connect(['tabs'])]);
