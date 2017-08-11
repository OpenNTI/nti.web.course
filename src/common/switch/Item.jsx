import React from 'react';
import PropTypes from 'prop-types';

export default class SwitchItem extends React.Component {
	static propTypes = {
		component: PropTypes.any.isRequired,
		name: PropTypes.string
	}


	get name () {
		return this.props.name;
	}


	render () {
		const {component:Cmp, ...otherProps} = this.props;

		delete otherProps.name;

		return (
			<Cmp {...otherProps} />
		);
	}
}
