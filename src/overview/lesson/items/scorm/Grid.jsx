import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { AssetIcon, List, Text } from '@nti/web-commons';
import { Button } from "@nti/web-core";
import { LinkTo, Router } from '@nti/web-routing';
import { isFlag } from '@nti/web-client';

import PaddedContainer from '../../common/PaddedContainer';

import Styles from './Grid.css';

const cx = classnames.bind(Styles);
const t = scoped('course.overview.lesson.items.scorm.Grid', {
	open: 'Launch',
});

const stop = e => e.stopPropagation();

const LAUNCH = 'launch';

function getRouteFor(object, context, router) {
	if (object?.isScormRef && context === LAUNCH) {
		return `${router.getRouteFor(object)}#${LAUNCH}`;
	}
}

function getLaunchLink(item) {
	const link = item.ScormContentInfo?.getLink?.('LaunchSCORM');

	return link
		? `${link}?redirecturl=${encodeURIComponent(global.location.href)}`
		: null;
}

LessonOverviewScormGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object,
	requiredLabel: PropTypes.node,
	completionLabel: PropTypes.node,
	noProgress: PropTypes.bool,
};
export default function LessonOverviewScormGridItem({
	item,
	course,
	requiredLabel,
	completionLabel,
}) {
	const completed = item.hasCompleted && item.hasCompleted();
	const success = item.completedSuccessfully && item.completedSuccessfully();
	const failed =
		item.completedUnsuccessfully && item.completedUnsuccessfully();
	const hasDescription = !!item.description;

	const inlineContent = isFlag('inline-scorm-content');

	const launchLink = getLaunchLink(item);

	const launchButtonProps = inlineContent
		? {
				as: LinkTo.Object,
				object: item,
				context: LAUNCH,
		  }
		: {
				href: launchLink,
				rel: 'external',
				disabled: !launchLink,
				onClick: stop,
		  };

	return (
		<Router.RouteForProvider getRouteFor={getRouteFor}>
			<PaddedContainer>
				<LinkTo.Object object={item}>
					<div
						className={cx('scorm-grid-card', {
							completed,
							success,
							failed,
							'has-description': hasDescription,
						})}
					>
						<AssetIcon
							className={cx('asset-icon')}
							src={item.icon}
							mimeType={item.MimeType}
						/>
						<div className={cx('meta')}>
							<Text limitLines={1} className={cx('title')}>
								{item.title}
							</Text>
							<Text limitLines={2} className={cx('description')}>
								{item.description}
							</Text>
							<List.SeparatedInline className={cx('list')}>
								{requiredLabel}
								{completionLabel}
							</List.SeparatedInline>
							<Button
								rounded
								className={cx('open-button')}
								{...launchButtonProps}
							>
								{t('open')}
							</Button>
						</div>
					</div>
				</LinkTo.Object>
			</PaddedContainer>
		</Router.RouteForProvider>
	);
}
