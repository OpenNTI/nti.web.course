import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';
import Controls from './Controls';


export default class SwitchPanel extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}


	static childContextTypes = {
		switchContext: PropTypes.shape({
			activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			hasItem: PropTypes.func,
			setActiveItem: PropTypes.func
		})
	}

	attachContainerRef = x => this.container = x

	constructor (props) {
		super(props);

		const {active} = props;

		this.state = {
			active
		};
	}


	getChildContext () {
		return {
			switchContext: {
				setActiveItem: (active) => this.setActiveItem(active)
			}
		};
	}


	componentWillReceiveProps (nextProps) {
		const {active:currentActive} = this.props;
		const {active:newActive} = nextProps;

		if (currentActive !== newActive) {
			this.setState({
				active: newActive
			});
		}
	}


	setActiveItem (active) {
		this.setState({
			active
		});
	}


	render () {
		const {children, ...otherProps} = this.props;
		const {active} = this.state;
		const items = React.Children.toArray(children);

		delete otherProps.active;

		return (
			<div {...otherProps}>
				{
					items.map((child) => {
						if (child.type === Controls) {
							return child;
						}

						if (child.type === Container) {
							return React.cloneElement(child, {ref: this.attachContainerRef, active});
						}
					})
				}
			</div>
		);
	}
}
