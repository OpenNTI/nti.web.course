import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Description from '../../common/Description';
import PaddedContainer from '../../common/PaddedContainer';

export default class BaseEnrolledDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getEnrolledDescription: PropTypes.func.isRequired
		}).isRequired
	}

	render () {
		const {option} = this.props;

		return (
			<div className="nti-course-enrollment-option-base-enrolled-description">
				<Description>
					{option.getEnrolledDescription()}
				</Description>
				{option.getGetAcquaintedWith && (
					<PaddedContainer className="link get-acquainted">
						<LinkTo.Object object={option.option} context="get-acquainted">
							{option.getGetAcquaintedWith()}
						</LinkTo.Object>
					</PaddedContainer>
				)}
				{option.getCopmleteProfile && (
					<PaddedContainer className="link complete-profile">
						<LinkTo.Object object={option.option} context="complete-profile">
							{option.getCopmleteProfile()}
						</LinkTo.Object>
					</PaddedContainer>
				)}
			</div>
		);
	}
}
