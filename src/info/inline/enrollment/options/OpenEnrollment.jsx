import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentCard from '../common/EnrollmentCard';
import OptionText, { TITLE, DESCRIPTION } from '../common/OptionText';

export default class OpenEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
	};

	state = {};

	render() {
		const { option } = this.props;

		return (
			<EnrollmentCard
				title={OptionText.getContentFor(option, TITLE)}
				description={OptionText.getContentFor(option, DESCRIPTION)}
				postTitleCmp={
					<div className="dot-suffix">
						<span className="free value">$0</span>
					</div>
				}
				className="open"
				{...this.props}
			/>
		);
	}
}
