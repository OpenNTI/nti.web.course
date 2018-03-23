import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DisplayName} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const t = scoped('course.progress.overview.Header', {
	page: '%(page)s of %(total)s'
});

export default class ProgressOverviewHEader extends React.Component {
	static propTypes = {
		doClose: PropTypes.func,
		singleItem: PropTypes.bool,

		currentItem: PropTypes.object,
		currentItemIndex: PropTypes.number,
		totalItems: PropTypes.number,

		hasNextItem: PropTypes.bool,
		hasPrevItem: PropTypes.bool,

		loadNextItem: PropTypes.func,
		loadPrevItem: PropTypes.func
	}


	doClose = () => {
		const {doClose} = this.props;

		if (doClose) {
			doClose();
		}
	}


	loadPrevItem = () => {
		const {loadPrevItem} = this.props;

		if (loadPrevItem) {
			loadPrevItem();
		}
	}


	loadNextItem = () => {
		const {loadNextItem} = this.props;

		if (loadNextItem) {
			loadNextItem();
		}
	}


	render () {
		const {singleItem, currentItem} = this.props;

		return (
			<div className="progress-overview-header">
				{!singleItem && currentItem && (this.renderPager())}
				{singleItem && !currentItem && (<div className="spacer"/>)}
				<div className="close" onClick={this.doClose}>
					<i className="icon-light-x" />
				</div>
			</div>
		);
	}


	renderPager () {
		const {currentItem, totalItems, currentItemIndex, hasNextItem, hasPrevItem} = this.props;

		return (
			<React.Fragment>
				<DisplayName entity={currentItem.UserProfile} />
				<div className="spacer" />
				<div className="current-page">
					{t('page', {page: currentItemIndex || 0, total: totalItems || 0})}
				</div>
				<div className={cx('page-up', 'page-control', {disabled: !hasPrevItem})} onClick={this.loadPrevItem}>
					<i className="icon-chevron-up" />
				</div>
				<div className={cx('page-down', 'page-control', {disabled: !hasNextItem})} onClick={this.loadNextItem}>
					<i className="icon-chevron-down" />
				</div>
			</React.Fragment>
		);
	}
}
