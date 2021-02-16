import React from 'react';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { Page } from '@nti/web-commons';

import Styles from './Styles.css';

const {
	Navigation: { Outline },
} = Page;
const t = scoped('course.overview.outline.header.NoProgress', {
	title: 'Outline',
});

NoProgress.handles = () => true;
export default function NoProgress() {
	return (
		<Outline.Header
			title={t('title')}
			className={cx(Styles['no-progress-header'])}
		/>
	);
}
