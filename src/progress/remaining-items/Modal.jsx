import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { Prompt } from '@nti/web-commons';

import Styles from './Modal.css';
import Items from './items';

const t = scoped('course.progress.remaining-items.Modal', {
	title: 'Course Progress',
});

const { PagingWindow } = Prompt;

RemainingItemsModal.propTypes = {
	className: PropTypes.string,
	course: PropTypes.object,
	onClose: PropTypes.func,
};
export default function RemainingItemsModal({
	className,
	course,
	onClose,
	...otherProps
}) {
	return (
		<PagingWindow
			className={cx(className, Styles['remaining-items-modal'])}
			onDismiss={onClose}
			title={t('title')}
			flat
			rounded
		>
			<Items course={course} {...otherProps} />
		</PagingWindow>
	);
}
