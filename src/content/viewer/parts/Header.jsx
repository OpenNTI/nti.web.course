import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

import Styles from './Header.css';

const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.parts.Header', {
	remaining: {
		requiredItems: {
			one: '%(count)s Required Item',
			other: '%(current)s of %(count)s Required Items',
		},
		allItems: {
			one: '%(count)s Item',
			other: '%(current)s of %(count)s Items',
		},
	},
	paging: {
		prefix: 'Page ',
		separator: ' of ',
	},
	previousItem: 'Previous Item',
	nextItem: 'Next Item',
});

function isConstrained(next) {
	const { item } = next || {};

	return item.isOutlineNode && item.contentIsConstrained;
}

export default class Header extends React.Component {
	static propTypes = {
		dismissPath: PropTypes.string,
		requiredOnly: PropTypes.bool,
		lessonInfo: PropTypes.shape({
			title: PropTypes.string,
			totalItems: PropTypes.number,
			currentItemIndex: PropTypes.number,
		}),
		location: PropTypes.shape({
			totalPages: PropTypes.number,
			currentPage: PropTypes.number,
		}),

		next: PropTypes.shape({
			item: PropTypes.object,
			lesson: PropTypes.object,
			relatedWorkRef: PropTypes.object,
		}),
		previous: PropTypes.shape({
			item: PropTypes.object,
			lesson: PropTypes.object,
			relatedWorkRef: PropTypes.object,
		}),

		header: PropTypes.bool,
	};

	render() {
		const { header = true } = this.props;

		return (
			<div className={cx('container')}>
				{header && this.renderClose()}
				{header && this.renderLesson()}
				{this.renderLessonProgress()}
				{header && this.renderLocation()}
				{header && this.renderPaging()}
			</div>
		);
	}

	renderClose() {
		const { dismissPath } = this.props;

		if (dismissPath) {
			return (
				<LinkTo.Path to={dismissPath} className={cx('close-button')}>
					<i className="icon-light-x" />
				</LinkTo.Path>
			);
		}

		return null;
	}

	renderLesson() {
		const { lessonInfo, requiredOnly } = this.props;

		if (!lessonInfo) {
			return <div className={cx('lesson-loading-skeleton')} />;
		}

		const localeKey = requiredOnly
			? 'remaining.requiredItems'
			: 'remaining.allItems';
		const current = lessonInfo.currentItemIndex + 1;
		const count = lessonInfo.totalItems;

		return (
			<div className={cx('lesson-container')}>
				<div className={cx('lesson-title')}>{lessonInfo.title}</div>
				<div className={cx('lesson-sub-title')}>
					{t(localeKey, { current, count })}
				</div>
			</div>
		);
	}

	renderLessonProgress() {
		const { lessonInfo } = this.props;

		if (!lessonInfo) {
			return null;
		}

		const progress =
			(lessonInfo.currentItemIndex + 1) / lessonInfo.totalItems;
		const percentage = Math.round(progress * 100);

		return (
			<div
				className={cx('lesson-progress')}
				style={{ width: `${percentage}%` }}
			/>
		);
	}

	renderLocation() {
		const { location } = this.props;

		if (!location || location.totalPages === 1) {
			return null;
		}

		return (
			<div className={cx('location')}>
				<span className={cx('location-prefix')}>
					{t('paging.prefix')}
				</span>
				<span className={cx('location-current-index')}>
					{location.currentPage + 1}
				</span>
				<span className={cx('location-separator')}>
					{t('paging.separator')}
				</span>
				<span className={cx('location-totalPages')}>
					{location.totalPages}
				</span>
			</div>
		);
	}

	renderPaging() {
		const { next, previous } = this.props;

		const showNext = next && !isConstrained(next);
		const showPrev = previous && !isConstrained(previous);

		return (
			<div className={cx('paging')}>
				{showPrev && (
					<LinkTo.Object
						object={previous.item}
						context={previous}
						className={cx('prev-link')}
						title={t('previousItem')}
					>
						<i className="icon-chevronup-25" />
					</LinkTo.Object>
				)}
				{!showPrev && (
					<span className={cx('prev-link-disabled')}>
						<i className="icon-chevronup-25" />
					</span>
				)}

				{showNext && (
					<LinkTo.Object
						object={next.item}
						context={next}
						className={cx('next-link')}
						title={t('nextItem')}
					>
						<i className="icon-chevrondown-25" />
					</LinkTo.Object>
				)}
				{!showNext && (
					<span className={cx('next-link-disabled')}>
						<i className="icon-chevrondown-25" />
					</span>
				)}
			</div>
		);
	}
}
