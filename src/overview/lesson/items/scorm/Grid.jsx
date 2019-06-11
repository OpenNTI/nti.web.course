import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {AssetIcon, Button, List} from '@nti/web-commons';
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
	noProgress: PropTypes.bool
};
export default function LessonOverviewScormGridItem ({item, course, requiredLabel}) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<div className={cx('scorm-grid-card')}>
					{item.icon && (<AssetIcon className={cx('asset-icon')} src={item.icon} mimeType={item.MimeType} />)}
					<div className={cx('meta')}>
						<div className={cx('title-container')}>
							<div className={cx('title')}>{item.title}</div>
							<Button className={cx('open-button')} rounded>{t('open')}</Button>
						</div>
						<List.SeparatedInline className={cx('list')}>
							{requiredLabel}
						</List.SeparatedInline>
						<div className={cx('description')}>{item.description}</div>
					</div>
				</div>
			</LinkTo.Object>
		</PaddedContainer>
	);

	// return (
	// 	<PaddedContainer>
	// 		<LinkTo.Object object={item}>
	// 			<div className="card">
	// 				<Card
	// 					data-ntiid={item.NTIID}
	// 					item={item}
	// 					contentPackage={course}
	// 					labels={[requiredLabel, commentLabel]}
	// 					noProgress={noProgress}
	// 				/>
	// 			</div>
	// 		</LinkTo.Object>
	// 	</PaddedContainer>
	// );
}