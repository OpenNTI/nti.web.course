import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

import Styles from './Header.css';

const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.parts.Header', {
	remaining: {
		one: '%(count)s item remaining in this lesson',
		other: '%(count)s items remaining in this lesson'
	},
	totalSeparator: ' of '
});


export default class Header extends React.Component {
	static propTypes = {
		onDismiss: PropTypes.func,
		lessonInfo: PropTypes.shape({
			title: PropTypes.string,
			totalItems: PropTypes.number,
			currentItemIndex: PropTypes.number
		}),
		location: PropTypes.shape({
			totalPages: PropTypes.number,
			currentPage: PropTypes.number
		}),
		next: PropTypes.object,
		previous: PropTypes.object
	}


	render () {
		return (
			<div className={cx('container')}>
				{this.renderClose()}
				{this.renderLesson()}
				{this.renderLessonProgress()}
				{this.renderLocation()}
				{this.renderPaging()}
			</div>
		);
	}


	renderClose () {
		return (
			<div className={cx('close-button')}>
				<i className="icon-light-x" />
			</div>
		);
	}


	renderLesson () {
		const {lessonInfo} = this.props;

		if (!lessonInfo) {
			return (
				<div className={cx('lesson-loading-skeleton')}>
					<div className={cx('lesson-title')} />
					<div className={cx('lesson-sub-title')} />
				</div>
			);
		}

		const remaining = lessonInfo.totalItems - lessonInfo.currentItemIndex - 1;

		return (
			<div className={cx('lesson-container')}>
				<div className={cx('lesson-title')}>
					{lessonInfo.title}
				</div>
				<div className={cx('lesson-sub-title')}>
					{t('remaining', {count: remaining})}
				</div>
			</div>
		);
	}


	renderLessonProgress () {
		const {lessonInfo} = this.props;

		if (!lessonInfo) { return null; }

		const progress = (lessonInfo.currentItemIndex + 1) / lessonInfo.totalItems;
		const percentage = Math.round(progress * 100);

		return (
			<div className={cx('lesson-progress')} style={{width: `${percentage}%`}}/>
		);
	}


	renderLocation () {
		const {location} = this.props;

		if (!location || location.totalPages === 1) { return null; }

		return (
			<div className={cx('location')}>
				<span className={cx('location-current-index')}>
					{location.currentPage + 1}
				</span>
				<span className={cx('location-separator')}>
					{t('totalSeparator')}
				</span>
				<span className={cx('location-totalPages')}>
					{location.totalPages}
				</span>
			</div>
		);
	}


	renderPaging () {
		const {next, previous} = this.props;

		return (
			<div className={cx('paging')}>
				{previous && (
					<LinkTo.Object object={previous} className={cx('prev-link')}>
						<i className="icon-chevronup-25" />
					</LinkTo.Object>
				)}
				{!previous && (
					<span className={cx('prev-link-disabled')}>
						<i className="icon-chevronup-25" />
					</span>
				)}

				{next && (
					<LinkTo.Object object={next} className={cx('next-link')}>
						<i className="icon-chevrondown-25" />
					</LinkTo.Object>
				)}
				{!next && (
					<span className={cx('next-link-disabled')}>
						<i className="icon-chevrondown-25" />
					</span>
				)}
			</div>
		);
	}
}
