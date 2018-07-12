import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';

export default class CourseEnrollmentOptionsFiveminuteDropButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getDropInfoTitle: PropTypes.func.isRequired,
			getDropInfoDescription: PropTypes.func.isRequired
		}).isRequired
	}


	render () {
		const {option} = this.props;

		return (
			<PaddedContainer className="nti-course-enrollment-options-five-minute-drop">
				<div className="title">{option.getDropInfoTitle()}</div>
				<div className="description">{option.getDropInfoDescription()}</div>
			</PaddedContainer>
		);
	}
}
