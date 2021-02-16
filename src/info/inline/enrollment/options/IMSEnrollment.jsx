import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentCard from '../common/EnrollmentCard';
import OptionText, { TITLE, DESCRIPTION } from '../common/OptionText';

export default class IMSEnrollment extends React.Component {
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
						<span className="value">
							{this.props.option.SourcedID}
						</span>
					</div>
				}
				className="ims"
				{...this.props}
			/>
		);
	}
}
