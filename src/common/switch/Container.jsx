import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

import Item from './Item';

const log = Logger.get('web:common:switch:Container');

export default class SwitchContainer extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}

	constructor (props) {
		super(props);

		this.state = {
			activeItem: this.getActiveItem(props)
		};
	}

	get items () {
		const {children} = this.props;

		return React.Children.toArray(children);
	}


	componentWillReceiveProps (nextProps) {
		const {active:oldActive} = this.props;
		const {active:newActive} = nextProps;

		if (oldActive !== newActive) {
			this.setState({
				activeItem: this.getActiveItem(nextProps)
			});
		}
	}


	getActiveItem (props = this.props) {
		const {children, active} = props;
		const items = React.Children.toArray(children);
		const activeItem = active || 0;

		const activeItems = items
			.map((item, index) => {
				if (!(item.type === Item)) {
					log.warn('Unexpected item in switch Container. Ignoring it.');
					return null;
				}

				const isActive = item.props.name === activeItem || index === activeItem;

				return isActive ? item : null;
			})
			.filter(item => !!item);

		if (activeItems.length > 1) {
			log.warn('More then one active item in switch Container. Ignoring all but the first');
		}

		return activeItems[0];
	}


	render () {
		const {...otherProps} = this.props;
		const {activeItem} = this.state;

		delete otherProps.children;
		delete otherProps.active;

		return (
			<div {...otherProps}>
				{activeItem}
			</div>
		);
	}
}
