import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {AssetIcon, Button, List, Text} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';

import Styles from './Grid.css';

const cx = classnames.bind(Styles);
const t = scoped('course.overview.lesson.items.scorm.Grid', {
	open: 'Open'
});

LessonOverviewScormGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object,
	requiredLabel: PropTypes.node,
	completionLabel: PropTypes.node,
	noProgress: PropTypes.bool
};
export default function LessonOverviewScormGridItem ({item, course, requiredLabel, completionLabel}) {
	const completed = item.hasCompleted && item.hasCompleted();
	const success = item.completedSuccessfully && item.completedSuccessfully();
	const failed = item.completedUnsuccessfully && item.completedUnsuccessfully();

	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<div className={cx('scorm-grid-card', {completed, success, failed})}>
					<AssetIcon className={cx('asset-icon')} src={item.icon} mimeType={item.MimeType} />
					<div className={cx('meta')}>
						<Text
							limitLines={1}
							overflow={Text.Ellipsis}
							className={cx('title')}
						>
							{item.title}
						</Text>
						<List.SeparatedInline className={cx('list')}>
							{completionLabel}
							{requiredLabel}
						</List.SeparatedInline>
						<Text
							limitLines={2}
							overflow={Text.Ellipsis}
							className={cx('description')}
						>
							{item.description}
						</Text>
						<Button className={cx('open-button')} rounded>{t('open')}</Button>
					</div>
				</div>
			</LinkTo.Object>
		</PaddedContainer>
	);
}