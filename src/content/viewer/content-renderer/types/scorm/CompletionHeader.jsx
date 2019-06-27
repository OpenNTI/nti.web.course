import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Layouts, List, DateTime} from '@nti/web-commons';

import Styles from './CompletionHeader.css';

const {Responsive} = Layouts;

const WIDE_CUTOFF = 600;
const isWide = ({containerWidth}) => containerWidth && containerWidth >= WIDE_CUTOFF;
const isNarrow = x => !isWide(x);

const cx = classnames.bind(Styles);
const t = scoped('course.content.viewer.content-renderer.types.scorm.CompletionHeader', {
	title: {
		success: 'You have met the requirements to pass.',
		fail: 'You have not met the requirements to pass.'
	},
	label: {
		fail: 'Not Satisfactory'
	},
	result: {
		label: 'Result',
		success: 'Passed',
		fail: 'Failed'
	},
	completedDate: 'Completed %(date)s'
});

export default class SCORMCompletionHeader extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	render () {
		const {item} = this.props;

		if (!item.hasCompleted || !item.hasCompleted()) { return null; }

		return (
			<Responsive.Container className={cx('scorm-completion-header-container')}>
				<Responsive.Item query={isWide} render={this.renderWider} />
				<Responsive.Item query={isNarrow} render={this.renderNarrow} />
			</Responsive.Container>
		);
	}

	renderWider = () => {
		return this.renderHeader('wide');
	}


	renderNarrow = () => {
		return this.renderHeader('narrow');
	}


	renderHeader (cls) {
		const {item} = this.props;
		const success = item.completedSuccessfully();
		const failed = item.completedUnsuccessfully();

		return (
			<div className={cx('scorm-completion-header', cls, {success, failed})}>
				<div className={cx('icon', {success, failed})} />
				{this.renderTitle(success, failed, item)}
				{this.renderSubTitle(success, failed, item)}
			</div>
		);
	}


	renderTitle (success) {
		const label = success ? t('title.success') : t('title.fail');
	
		return (
			<div className={cx('title')}>
				{label}
			</div>
		);
	}


	renderSubTitle (success, failed, item) {
		const date = item.getCompletedDate();
		const formattedDate = date && DateTime.format(date, 'dddd, MMMM D [at] h:mmA ');

		if (!failed && !formattedDate) { return null; }

		return (
			<List.SeparatedInline className={cx('meta')}>
				{failed && (<span className={cx('failed-label')}>{t('label.fail')}</span>)}
				{formattedDate && (<span className={cx('completedDate')}>{t('completedDate', {date: formattedDate})}</span>)}
			</List.SeparatedInline>
		);
	}
}