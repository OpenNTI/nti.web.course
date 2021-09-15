import React from 'react';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Layouts, List, DateTime } from '@nti/web-commons';
import { useChanges } from '@nti/web-core';

import styles from './CompletionHeader.css';

const { Responsive } = Layouts;

const WIDE_CUTOFF = 600;
const isWide = ({ containerWidth }) =>
	containerWidth && containerWidth >= WIDE_CUTOFF;
const isNarrow = x => !isWide(x);

const cx = classnames.bind(styles);
const t = scoped(
	'course.content.viewer.content-renderer.types.scorm.CompletionHeader',
	{
		title: {
			success: 'You have met the requirements to pass.',
			fail: 'You have not met the requirements to pass.',
		},
		label: {
			fail: 'Not Satisfactory',
		},
		result: {
			label: 'Result',
			success: 'Passed',
			fail: 'Failed',
		},
		completedDate: 'Completed %(date)s',
	}
);

export default function SCORMCompletionHeader({ item }) {
	useChanges(item);
	if (!item.hasCompleted || !item.hasCompleted()) {
		return null;
	}

	return (
		<Responsive.Container
			className={cx('scorm-completion-header-container')}
		>
			<Responsive.Item
				query={isWide}
				component={Header}
				className="wide"
				item={item}
			/>
			<Responsive.Item
				query={isNarrow}
				component={Header}
				className="narrow"
				item={item}
			/>
		</Responsive.Container>
	);
}

function Header({ className, item }) {
	const success = item.completedSuccessfully();
	const failed = item.completedUnsuccessfully();
	const date = item.getCompletedDate();
	const formattedDate =
		date && DateTime.format(date, DateTime.WEEKDAY_MONTH_NAME_DAY_AT_TIME);

	return (
		<div
			className={cx('scorm-completion-header', className, {
				success,
				failed,
			})}
		>
			<div className={cx('icon', { success, failed })} />
			<div className={cx('title')}>
				{success ? t('title.success') : t('title.fail')}
			</div>
			{!failed && !formattedDate ? null : (
				<List.SeparatedInline className={cx('meta')}>
					{failed && (
						<span className={cx('failed-label')}>
							{t('label.fail')}
						</span>
					)}
					{formattedDate && (
						<span className={cx('completedDate')}>
							{t('completedDate', { date: formattedDate })}
						</span>
					)}
				</List.SeparatedInline>
			)}
		</div>
	);
}
