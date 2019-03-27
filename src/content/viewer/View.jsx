import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Layouts, Decorators} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Styles from './View.css';
import Content from './content-renderer';
import Header from './parts/Header';
import UpNext from './parts/UpNext';

const {Aside} = Layouts;
const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.View', {
	error: 'Unable to load content.'
});

export default
@Decorators.addClassToRoot('nti-course-content-open')
class CourseContentViewer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		error: PropTypes.any,
		location: PropTypes.shape({
			item: PropTypes.object,
			totalPages: PropTypes.number,
			currentPage: PropTypes.number
		})
	}

	render () {
		const {
			className,
			error,
			location,
			...otherProps
		} = this.props;
		const loading = !location;

		return (
			<Aside.Container className={cx('nti-course-content', className, {loading})}>
				{error && (
					<div className={cx('contents-error')}>
						{t('error')}
					</div>
				)}
				{!error && (
					<div className={cx('contents')}>
						<Header location={location} {...otherProps} />
						<Content location={location} {...otherProps} />
						<UpNext location={location} {...otherProps} />
					</div>
				)}
			</Aside.Container>
		);
	}
}
