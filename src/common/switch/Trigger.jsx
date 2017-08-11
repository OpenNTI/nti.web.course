import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SwitchTrigger extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		onClick: PropTypes.func,
		children: PropTypes.node
	}

	static contextTypes = {
		switchContext: PropTypes.shape({
			setActiveItem: PropTypes.func
		})
	}

	get switchContext () {
		return this.context.switchContext || {};
	}


	onClick = () => {
		const {item} = this.props;
		const {setActiveItem} = this.switchContext;

		if (setActiveItem) {
			setActiveItem(item);
		}
	}





	render () {
		const {item, className, children, ...otherProps} = this.props;
		const active = false;
		const disabled = false;

		return (
			<div {...otherProps} className={cx(className, {active, disabled})} onClick={this.onClick} >
				{children}
			</div>
		);
	}
}
