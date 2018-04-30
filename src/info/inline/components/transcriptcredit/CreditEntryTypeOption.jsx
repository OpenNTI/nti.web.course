import React from 'react';
import PropTypes from 'prop-types';

export default class CreditEntryTypeOption extends React.Component {
	static propTypes = {
		option: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired
	}

	onClick = () => {
		this.props.onClick(this.props.option);
	}

	render () {
		const {option} = this.props;

		return <div className="credit-entry-type-option" onClick={this.onClick}>{option}</div>;
	}
}
