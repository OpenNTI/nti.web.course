import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

import Item from './Item';

const log = Logger.get('web:common:switch:Container');

export default class SwitchContainer extends React.Component {
	static getItems (container) {
		const {children} = container.props;

		return React.Children.toArray(children);
	}

	static propTypes = {
		children: PropTypes.any,
		active: PropTypes.string
	}

	get items () {
		return SwitchContainer.getItems(this);
	}

	render () {
		const {items} = this;
		const {active, ...otherProps} = this.props;

		const renderItems = items
			.filter((item) => {
				if (item.type !== Item) {
					log.warn('Unexpected child passed to SwitcherContainer. Dropping it');
					return false;
				}

				return true;
			})
			.map((item, key) => {
				return React.cloneElement(item, {key, active});
			});

		return (
			<div {...otherProps}>
				{renderItems}
			</div>
		);
	}
}
