import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

const t = scoped('course.components.progress-window.Pager', {
	number: '%(current)s of %(total)s'
});

export default class ProgressPager extends React.Component {
	static propTypes = {
		current: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
		onPageChange: PropTypes.func
	}

	constructor (props) {
		super(props);
	}

	state = {}

	renderNumbers () {
		const {current, total} = this.props;

		return (
			<div className="page-numbers">
				{t('number',  { current, total })}
			</div>
		);
	}

	goToPrevious = () => {
		const {current, onPageChange} = this.props;

		if(current === 1) {
			return;
		}

		onPageChange && onPageChange(current - 1);
	}

	goToNext = () => {
		const {current, total, onPageChange} = this.props;

		if(current === total) {
			return;
		}

		onPageChange && onPageChange(current + 1);
	}

	renderControls () {
		const {current, total} = this.props;

		const prevClass = cx('prev', { inactive: current === 1});
		const nextClass = cx('next', { inactive: current === total});

		return (
			<div className="page-controls">
				<span className={prevClass} onClick={this.goToPrevious}><i className="icon-chevron-up"/></span>
				<span className={nextClass} onClick={this.goToNext}><i className="icon-chevron-down"/></span>
			</div>
		);
	}

	render () {
		return (
			<div className="progress-pager">
				{this.renderNumbers()}
				{this.renderControls()}
			</div>
		);
	}
}
