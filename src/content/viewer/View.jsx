import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getScrollParent, scrollElementTo } from '@nti/lib-dom';
import { Layouts, Page, useExternClassName } from '@nti/web-commons';
import { getHistory } from '@nti/web-routing';

import Content from './content-renderer';
import Header from './parts/Header';
import UpNext from './parts/UpNext';
import styles from './View.css';

const { Aside } = Layouts;

CourseContentViewer.ContentTypes = Content.ContentTypes;
CourseContentViewer.propTypes = {
	aside: PropTypes.bool,
	error: PropTypes.any,
	location: PropTypes.shape({
		item: PropTypes.object,
		totalPages: PropTypes.number,
		currentPage: PropTypes.number,
	}),
};

export default function CourseContentViewer({
	className,
	error,
	location,
	aside = true,
	...otherProps
}) {
	useExternClassName('nti-course-content-open');
	const domNode = useRef();
	const { current: prev } = useRef({});

	useEffect(() => {
		const i = x => x?.item;
		if (i(location) !== i(prev.location)) {
			const scroller = getScrollParent(domNode.current);

			if (scroller) {
				scrollElementTo(scroller, 0, 0);
			}
		}

		prev.location = location;
	}, [location]);

	const loading = !location;
	const Cmp = aside ? Aside.Container : 'div';

	return (
		<Cmp
			ref={domNode}
			className={cx('nti-course-content', className, { loading })}
		>
			<div className={styles.contents}>
				<Header location={location} {...otherProps} />
				{error && (
					<Page.Content.NotFound
						error={error}
						actions={[
							Page.Content.NotFound.getBackAction(getHistory()),
						]}
					/>
				)}
				{!error && <Content location={location} {...otherProps} />}
				<UpNext location={location} {...otherProps} />
			</div>
		</Cmp>
	);
}
