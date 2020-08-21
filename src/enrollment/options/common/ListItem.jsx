import './ListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.options.common.ListItem', {
	metaSeparator: '-',
	price: {
		free: 'Free',
		cost: '%(price)s'
	},
	enrolled: 'Currently Enrolled In'
});

export default class CourseEnrollmentOptionsListItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string.isRequired,
		price: PropTypes.number,
		enrolled: PropTypes.bool,
		selected: PropTypes.bool,
		onSelect: PropTypes.func
	}

	onClick = () => {
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect();
		}
	}

	render () {
		const {title, selected, className} = this.props;

		return (
			<div className={cx('nti-course-enrollment-option-list-item', className, {selected})} onClick={this.onClick}>
				<div className="title">{title}</div>
				{this.renderMeta()}
			</div>
		);
	}

	renderMeta () {
		const {enrolled} = this.props;

		return (
			<div className="meta">
				{this.renderPrice()}
				{enrolled && this.renderSeparator()}
				{enrolled && this.renderEnrolled()}
			</div>
		);
	}


	renderPrice () {
		const {price} = this.props;

		return (
			<div className="price">
				{price == null ? t('price.free') : t('price.cost', {price})}
			</div>
		);
	}


	renderSeparator () {
		return (
			<div className="separator">{t('metaSeparator')}</div>
		);
	}


	renderEnrolled () {
		return (
			<div className="enrolled">{t('enrolled')}</div>
		);
	}
}
