import React from 'react';
import PropTypes from 'prop-types';

export default class Preview extends React.Component {
	static propTypes = {
		imageSrc: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired
	}

	render () {
		const { imageSrc, label } = this.props;

		return (
			<div className="asset-preview">
				<div className="image-container">
					<img src={imageSrc} width="40" height="40"/>
				</div>
				<div className="label">{label}</div>
			</div>
		);
	}
}
