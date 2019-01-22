import React from 'react';
// import PropTypes from 'prop-types';

import Pie from './PieChart';

export default class Header extends React.Component {
	render () {
		return (
			<header>
				<Pie />	
			</header>
		);
	}
}