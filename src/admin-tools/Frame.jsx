import './Frame.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Loading } from '@nti/web-commons';

export default class CourseAdminView extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		loading: PropTypes.bool,
		children: PropTypes.element,
	};

	render() {
		const { loading } = this.props;

		return (
			<div className={cx('course-admin-tools-view', { loading })}>
				{loading ? <Loading.Mask /> : this.renderCourse()}
			</div>
		);
	}

	renderCourse() {
		const { course, children } = this.props;

		if (!course) {
			return null;
		}

		return (
			<div>
				{React.Children.map(children, item => {
					return React.cloneElement(item, { course });
				})}
			</div>
		);
	}
}
