import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.options.common.ListItem', {
	price: {
		free: 'Free',
		cost: '$%(price)s'
	}
});

export default class CourseEnrollmentOptionsListItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string.isRequired,
		price: PropTypes.number,
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
		const {title, selected} = this.props;

		return (
			<div className={cx('nti-course-enrollment-option-list-item', {selected})} onClick={this.onClick}>
				<div className="title">{title}</div>
				<div className="meta">
					{this.renderPrice()}
				</div>
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
}
