import React from 'react';
import PropTypes from 'prop-types';

import {getItemName} from './utils';

export default class SwitchItem extends React.Component {
	static propTypes = {
		component: PropTypes.any.isRequired,
		name: PropTypes.string,
		active: PropTypes.string
	}


	get name () {
		return getItemName(this);
	}


	render () {
		const {component:Cmp, name, active, ...otherProps} = this.props;

		return name === active ?
			(<Cmp {...otherProps} />) :
			null;
	}
}
