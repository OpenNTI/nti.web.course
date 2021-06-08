import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getScrollParent, scrollElementTo } from '@nti/lib-dom';
import { Layouts, Page, useExternClassName } from '@nti/web-commons';
import { getHistory, NavigationStackManager } from '@nti/web-routing';

import Content from './content-renderer';
import Header from './parts/Header';
import UpNext from './parts/UpNext';

const { Aside } = Layouts;

const Contents = styled.div`
	background: white;
`;

stylesheet`
:global(.nti-course-content-open body > .modal + .modal .modal-mask) {
	background: rgba(0, 0, 0, 0.7);

	/* ugh. on top of ext .nti-course-content-open .window-container @ 1002.
	manifests when a webinar registration window is open on top of the
	lesson viewer. */
	z-index: 1010;
}
`;

Viewer.ContentTypes = Content.ContentTypes;
Viewer.propTypes = {
	aside: PropTypes.bool,
	error: PropTypes.any,
	location: PropTypes.shape({
		item: PropTypes.object,
		totalPages: PropTypes.number,
		currentPage: PropTypes.number,
	}),
};
Viewer.displayName = 'CourseContentViewer';
export function Viewer({
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
			<NavigationStackManager>
				<Contents>
					<Header location={location} {...otherProps} />
					{error && (
						<Page.Content.NotFound
							error={error}
							actions={[
								Page.Content.NotFound.getBackAction(
									getHistory()
								),
							]}
						/>
					)}
					{!error && <Content location={location} {...otherProps} />}
					<UpNext location={location} {...otherProps} />
				</Contents>
			</NavigationStackManager>
		</Cmp>
	);
}
