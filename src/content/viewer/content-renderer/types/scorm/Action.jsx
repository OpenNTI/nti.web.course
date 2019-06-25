import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Button} from '@nti/web-commons';

import Styles from './Action.css';

const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.content-renderer.types.scorm.Action', {
	message: 'To access our content, click the link below.',
	open: 'Open'
});

function getLaunchLink (item) {
	const link = item.ScormContentInfo && item.ScormContentInfo.getLink('LaunchSCORM');

	return link ? `${link}?redirecturl=${encodeURIComponent(global.location.href)}` : null;
}

SCORMAction.propTypes = {
	item: PropTypes.shape({
		getLink: PropTypes.func
	})
};
export default function SCORMAction ({item}) {
	const link = getLaunchLink(item);
	let button = (
		<Button className={cx('launch')} href={link} rel="external" disabled={!link}>
			<span>{t('open')}</span>
			<i className="icon-launch" />
		</Button>
	);

	return (
		<div className={cx('scorm-action')}>
			<div className={cx('message')}>{t('message')}</div>
			{button}
		</div>
	);
}