import './DropButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

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
				<div className="title" {...rawContent(option.getDropInfoTitle())} />
				<div className="description" {...rawContent(option.getDropInfoDescription())} />
			</PaddedContainer>
		);
	}
}
