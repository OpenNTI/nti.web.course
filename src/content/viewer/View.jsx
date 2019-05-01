import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {getScrollParent} from '@nti/lib-dom';
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
	static ContentTypes = Content.ContentTypes

	static propTypes = {
		className: PropTypes.string,
		error: PropTypes.any,
		location: PropTypes.shape({
			item: PropTypes.object,
			totalPages: PropTypes.number,
			currentPage: PropTypes.number
		}),

		noAside: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.domNode = React.createRef();
	}

	componentDidUpdate ({location: prevLoc}) {
		const {location} = this.props;

		const i = x => (x || {}).item;

		if (i(location) !== i(prevLoc)) {
			const scroller = getScrollParent(this.domNode.current);
			if (scroller && scroller.scrollTo) {
				scroller.scrollTo(0, 0);
			}
		}
	}

	render () {
		const {
			className,
			error,
			location,
			noAside,
			...otherProps
		} = this.props;
		const loading = !location;
		const Cmp = noAside ? 'div' : Aside.Container;

		return (
			<Cmp ref={this.domNode} className={cx('nti-course-content', className, {loading})}>
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
			</Cmp>
		);
	}
}
