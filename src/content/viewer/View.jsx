import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {decorate} from '@nti/lib-commons';
import {getScrollParent, scrollElementTo} from '@nti/lib-dom';
import {Layouts, Decorators, Page} from '@nti/web-commons';
import {getHistory} from '@nti/web-routing';

import Styles from './View.css';
import Content from './content-renderer';
import Header from './parts/Header';
import UpNext from './parts/UpNext';

const {Aside} = Layouts;
const cx = classnames.bind(Styles);

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

			if (scroller) {
				scrollElementTo(scroller, 0, 0);
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
				<div className={cx('contents')}>
					<Header location={location} {...otherProps} />
					{error && (
						<Page.Content.NotFound
							error={error}
							actions={[
								Page.Content.NotFound.getBackAction(getHistory())
							]}
						/>
					)}
					{!error && (<Content location={location} {...otherProps} />)}
					<UpNext location={location} {...otherProps} />
				</div>
			</Cmp>
		);
	}
}

export default decorate(CourseContentViewer, [
	Decorators.addClassToRoot('nti-course-content-open')
]);
