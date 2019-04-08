import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {LinkTo} from '@nti/web-routing';
import {scoped} from '@nti/lib-locale';

import {Constants} from '../../../overview/lesson/';
import OverviewItems from '../../../overview/lesson/items';

import Styles from './UpNext.css';

const cx = classnames.bind(Styles);

const t = scoped('course.content.viewer.parts.UpNext', {
	nextPage: 'Next Page',
	lessonFinished: 'Next Lesson',
	upNext: 'Up Next'
});

function isEndOfCourse (next) {
	return !next;
}


function isEndOfLesson (next, lessonInfo) {
	const {lesson} = next || {};
	const {href, id:lessonId, outlineNodeId} = lessonInfo;

	if (!lesson) { return false; }

	const idsToCheckMap = {
		[lessonId]: true,
		[outlineNodeId]: true
	};

	const isSameLesson = idsToCheckMap[lesson.NTIID]
		|| idsToCheckMap[lesson.ContentNTIID]
		|| lesson.getLink('overview-content') === href;

	return lesson && !isSameLesson;
}

function nextIsSubPage (next, lessonInfo) {
	const {item} = next || {};
	const {nextItem} = lessonInfo || {};

	return item && (!nextItem || nextItem.getID() !== item.getID());
}


export default class UpNext extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		lessonInfo: PropTypes.shape({
			remainingItems: PropTypes.array
		}),
		next: PropTypes.shape({
			item: PropTypes.object
		})
	}

	render () {
		const {lessonInfo, next} = this.props;

		if (!lessonInfo) { return null; }

		const endOfCourse = isEndOfCourse(next, lessonInfo);
		const endOfLesson = isEndOfLesson(next, lessonInfo);
		const subPage = nextIsSubPage(next, lessonInfo);

		return (
			<div className={cx('up-next')}>
				{endOfCourse && this.renderEndOfCourse(next, lessonInfo)}
				{!endOfCourse && endOfLesson && this.renderEndOfLesson(next, lessonInfo)}
				{!endOfCourse && !endOfLesson && subPage && this.renderSubPage(next, lessonInfo)}
				{!endOfCourse && !endOfLesson && !subPage && this.renderNextItem(next, lessonInfo)}
			</div>
		);
	}


	renderEndOfCourse () {
		//TODO: figure out what we need to do here
		return null;
	}


	renderEndOfLesson (next) {
		const {lesson} = next || {};

		if (!lesson) { return null; }

		return (
			<LinkTo.Object object={next.item} context={next} className={cx('next-lesson')}>
				<div className={cx('sub-title')}>
					<i className="icon-check" />
					<span>{t('lessonFinished')}</span>
				</div>
				<div className={cx('title')}>
					<span>{lesson.title}</span>
					<i className="icon-chevron-right" />
				</div>
			</LinkTo.Object>
		);
	}


	renderSubPage (next) {
		if (!next || !next.item) { return null; }

		return (
			<LinkTo.Object object={next.item} context={next} className={cx('next-page')}>
				<span>{t('nextPage')}</span>
				<i className="icon-chevron-down" />
			</LinkTo.Object>
		);
	}


	renderNextItem (next) {
		if (!next || !next.item) { return null; }

		const {course} = this.props;

		return (
			<div className={cx('remaining-items')}>
				<div className={cx('title')}>{t('upNext')}</div>
				<OverviewItems layout={Constants.List} items={[next.item]} course={course} />
			</div>
		);
	}
}
