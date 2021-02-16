import React from 'react';
import PropTypes from 'prop-types';
import { LinkTo } from '@nti/web-routing'; // eslint-disable-line
import { Layouts } from '@nti/web-commons';

import NavBar from './nav-bar';

export default class CourseAdminAdvancedView extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		course: PropTypes.object,
	};

	render() {
		return (
			<div className="course-admin-advanced-view">
				{this.renderLayout()}
			</div>
		);
	}

	renderLayout() {
		const { children, course } = this.props;

		return (
			<Layouts.NavContent.Container>
				<Layouts.NavContent.Nav className="nav-bar">
					<NavBar course={course} />
				</Layouts.NavContent.Nav>
				<Layouts.NavContent.Content className="content">
					{React.Children.map(children, item => {
						return React.cloneElement(item, {});
					})}
				</Layouts.NavContent.Content>
			</Layouts.NavContent.Container>
		);
	}
}
