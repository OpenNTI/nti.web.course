import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Prompt, Hooks} from '@nti/web-commons';

import Styles from './Modal.css';
import Items from './items';
import {getRemainingCount, getPercentageComplete} from './utils';

const t = scoped('course.progress.remaining-items.Modal', {
	title: 'Course Progress',
	mobileTitle: 'Remaining Items',
	remaining: {
		one: '%(count)s Remaining Item',
		other: '%(count)s Remaining Items'
	}
});

const {PagingWindow} = Prompt;
const {useMobileValue} = Hooks;

RemainingItemsModal.propTypes = {
	className: PropTypes.string,
	course: PropTypes.object,
	onClose: PropTypes.func
};
export default function RemainingItemsModal ({className, course, onClose, ...otherProps}) {
	const title = useMobileValue(t('mobileTitle'), t('title'));
	const subTitle = useMobileValue('', t('remaining', {count: getRemainingCount(course)}));

	return (
		<PagingWindow
			className={cx(className, Styles['remaining-items-modal'])}
			onDismiss={onClose}
			title={title}
			subTitle={subTitle}
			progress={getPercentageComplete(course)}
		>
			<Items course={course} {...otherProps} />
		</PagingWindow>
	);
}

