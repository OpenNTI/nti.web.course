import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentCard from '../common/EnrollmentCard';
import OptionText, {TITLE, DESCRIPTION} from '../common/OptionText';

export default class FiveMinuteEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired
	}

	state = {}

	//	'Price', 'CRN', 'Term'

	render () {
		const {option} = this.props;

		return (
			<EnrollmentCard
				title={OptionText.getContentFor(option, TITLE)}
				description={OptionText.getContentFor(option, DESCRIPTION)}
				// postTitleCmp={<div className="dot-suffix"><span className="value">{this.props.option.SourcedID}</span></div>}
				className="five-minute"
				{...this.props}
			/>
		);
	}
}
