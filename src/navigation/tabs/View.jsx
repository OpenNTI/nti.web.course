import React from 'react';
import PropTypes from 'prop-types';

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
		const {course} = this.props;
		const {id, isRootRoute} = tab;
		const baseRoute = this.context.router.baseroute;
		const activeRoute = this.context.router.route.location.pathname;
		const route = this.context.router.getRouteFor(course, id);

		const isActive = activeRoute.indexOf(route) === 0 || (isRootRoute && activeRoute === baseRoute);

		return (
			<div key={id}>
				{`${route}-${isActive ? 'active' : 'not-active'}`}
			</div>
		);
	}
}
