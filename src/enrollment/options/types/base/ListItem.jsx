import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '../../common/ListItem';

export default class BaseEnrollmentListItem extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getPriceDisplay: PropTypes.func,
			getTitle: PropTypes.func.isRequired,
			getPrice: PropTypes.func.isRequired,
			isEnrolled: PropTypes.func.isRequired,
		}),
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
	};

	onSelect = () => {
		const { option, onSelect } = this.props;

		if (onSelect) {
			onSelect(option);
		}
	};

	render() {
		const { option, selected } = this.props;

		return (
			<ListItem
				title={option.getTitle()}
				price={option.getPriceDisplay && option.getPriceDisplay()}
				enrolled={option.isEnrolled()}
				selected={selected}
				onSelect={this.onSelect}
			/>
		);
	}
}
