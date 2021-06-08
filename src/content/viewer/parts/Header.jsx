import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Registry as Base } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Icons } from '@nti/web-commons';
import { LinkTo, NavigationStackContext } from '@nti/web-routing';

import styles from './Header.css';

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

export class Registry extends Base.Handler {
	/**
	 * @param {(item: any) => boolean} predicate
	 * @param {React.Component | () => React.ReactElement} Component
	 */
	static register(predicate, Component) {
		this.getInstance().register(predicate, Component);
	}

	/**
	 *
	 * @param {any} item
	 * @returns {React.Component | () => React.ReactElement}
	 */
	static lookup(item) {
		const component = item && this.getInstance().getItem(item);

		return !component?.applies
			? component
			: component.applies(item)
			? component
			: null;
	}
}

Header.propTypes = {
	dismissPath: PropTypes.string,
	requiredOnly: PropTypes.bool,
	lessonInfo: PropTypes.shape({
		title: PropTypes.string,
		totalItems: PropTypes.number,
		currentItemIndex: PropTypes.number,
	}),
	location: PropTypes.shape({
		totalPages: PropTypes.number,
		item: PropTypes.any,
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

export default function Header({ header = true, ...props }) {
	return (
		<div className={styles.container}>
			{header && <Close {...props} />}
			{header && <Lesson {...props} />}
			{<LessonProgress {...props} />}
			{header && <Location {...props} />}
			{header && <Paging {...props} />}
		</div>
	);
}

function Close({ dismissPath }) {
	const { pop } = useContext(NavigationStackContext);

	const doPop = e => {
		if (!pop) return;

		e.preventDefault();
		e.stopPropagation();
		pop();
	};

	return !dismissPath ? null : (
		<LinkTo.Path
			to={dismissPath}
			onClick={doPop}
			className={styles.closeButton}
		>
			{pop ? (
				<Icons.Chevron.Left skinny />
			) : (
				<i className="icon-light-x" />
			)}
		</LinkTo.Path>
	);
}

function Lesson({ lessonInfo, location, requiredOnly }) {
	if (!lessonInfo) {
		return <div className={styles.lessonLoadingSkeleton} />;
	}

	const localeKey = requiredOnly
		? 'remaining.requiredItems'
		: 'remaining.allItems';
	const current = lessonInfo?.currentItemIndex + 1;
	const count = lessonInfo?.totalItems;

	const { item } = location || {};
	const SpecialCase = Registry.lookup(item);

	return (
		<div className={styles.lessonContainer}>
			{SpecialCase ? (
				<SpecialCase item={item} />
			) : (
				<>
					<div className={styles.lessonTitle}>
						{lessonInfo?.title}
					</div>
					<div className={styles.lessonSubTitle}>
						{t(localeKey, { current, count })}
					</div>
				</>
			)}
		</div>
	);
}

function LessonProgress({ lessonInfo }) {
	if (!lessonInfo) {
		return null;
	}

	const progress = (lessonInfo.currentItemIndex + 1) / lessonInfo.totalItems;
	const percentage = Math.round(progress * 100);

	return (
		<div
			className={styles.lessonProgress}
			style={{ width: `${percentage}%` }}
		/>
	);
}

function Location({ location }) {
	if (!location || location.totalPages === 1) {
		return null;
	}

	return (
		<div className={styles.location}>
			<span className={styles.locationPrefix}>{t('paging.prefix')}</span>
			<span className={styles.locationCurrentIndex}>
				{location.currentPage + 1}
			</span>
			<span className={styles.locationSeparator}>
				{t('paging.separator')}
			</span>
			<span className={styles.locationTotalPages}>
				{location.totalPages}
			</span>
		</div>
	);
}

function Paging({ next, previous }) {
	const showNext = next && !isConstrained(next);
	const showPrev = previous && !isConstrained(previous);

	return (
		<div className={styles.paging}>
			{showPrev && (
				<LinkTo.Object
					object={previous.item}
					context={previous}
					className={styles.prevLink}
					title={t('previousItem')}
				>
					<Icons.Chevron.Up skinny />
				</LinkTo.Object>
			)}
			{!showPrev && (
				<span className={styles.prevLinkDisabled}>
					<Icons.Chevron.Up skinny />
				</span>
			)}

			{showNext && (
				<LinkTo.Object
					object={next.item}
					context={next}
					className={styles.nextLink}
					title={t('nextItem')}
				>
					<Icons.Chevron.Down skinny />
				</LinkTo.Object>
			)}
			{!showNext && (
				<span className={styles.nextLinkDisabled}>
					<Icons.Chevron.Down skinny />
				</span>
			)}
		</div>
	);
}
