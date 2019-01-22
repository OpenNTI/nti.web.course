import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {SortOrder} from '@nti/lib-interfaces';

import styles from './SortableHeader.css';

const cx = classnames.bind(styles);

export default class SortableHeader extends React.PureComponent {

	static propTypes = {
		setSort: PropTypes.func,
		sortOn: PropTypes.string,
		sortedOn: PropTypes.string,
		sortedOrder: PropTypes.string,
		onClick: PropTypes.func
	}

	onClick = (e) => {
		const {setSort, sortOn, sortedOn, sortedOrder, onClick} = this.props;

		if (typeof setSort === 'function') {
			// flip sort direction if we're already sorted on this key
			const sortOrder = (sortedOn === sortOn)
				? sortedOrder === SortOrder.ASC
					? SortOrder.DESC
					: SortOrder.ASC
				: sortedOrder;
			
			setSort(sortOn, sortOrder);
	
			if (onClick) {
				onClick(e);
			}
		}
	}

	render () {
		const {children, className, sortOn, sortedOn, sortedOrder} = this.props;

		const sorted = sortOn && sortedOn === sortOn;
		const asc = sorted && sortedOrder === SortOrder.ASC;
		const desc = sorted && sortedOrder === SortOrder.DESC;

		return (
			<div className={cx('header', {sorted, asc, desc}, className)} onClick={this.onClick}>{children}</div>
		);
	}
}
