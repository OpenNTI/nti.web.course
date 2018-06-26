import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '../../common/ListItem';

export default class BaseEnrollmentListItem extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getTitle: PropTypes.func.isRequired,
			getPrice: PropTypes.func.isRequired
		}),
		selected: PropTypes.bool,
		onSelect: PropTypes.func
	}


	onSelect = () => {
		const {option, onSelect} = this.props;

		if (onSelect) {
			onSelect(option);
		}
	}


	render () {
		const {option, selected} = this.props;

		return (
			<ListItem
				title={option.getTitle()}
				price={option.getPrice()}
				selected={selected}
				onSelect={this.onSelect}
			/>
		);
	}
}
