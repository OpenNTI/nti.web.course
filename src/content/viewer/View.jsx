import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Styles from './View.css';
import Header from './parts/Header';
import UpNext from './parts/UpNext';

const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.View', {
	error: 'Unable to load content.'
});

export default
@Store.connect(['sidebarCmp', 'sidebarProps'])
class CourseContentViewer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		error: PropTypes.any,
		location: PropTypes.shape({
			item: PropTypes.object,
			totalPages: PropTypes.number,
			currentPage: PropTypes.number
		}),

		sidebarCmp: PropTypes.object,
		sidebarProps: PropTypes.object
	}

	render () {
		const {
			className,
			error,
			sidebarCmp:SidebarCmp,
			sidebarProps,
			location,
			...otherProps
		} = this.props;
		const hasSidebar = !!SidebarCmp;
		const loading = !location;

		return (
			<div className={cx('nti-course-content', className, {loading, sidebar: hasSidebar})}>
				{error && (
					<div className={cx('contents-error')}>
						{t('error')}
					</div>
				)}
				{!error && (
					<div className={cx('contents')}>
						<Header location={location} {...otherProps} />
						Contents
						<UpNext location={location} {...otherProps} />
					</div>
				)}
				<div className={cx('sidebar')}>
					Sidebar
					{hasSidebar && (<SidebarCmp {...sidebarProps} />)}
				</div>
			</div>
		);
	}
}
