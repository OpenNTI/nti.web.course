import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import ActionItem from '../../common/ActionItem';

export default class CourseEnrollmentBaseTypeDropButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			option: PropTypes.object.isRequired,
			getDropButtonLabel: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const label = option.getDropButtonLabel && option.getDropButtonLabel();

		if (!label) { return (<div className="course-enrollment-options-base-type-drop-button" />); }

		return (
			<LinkTo.Object className="course-enrollment-options-base-type-drop-button" object={option.option} context="drop">
				<ActionItem>
					{label}
				</ActionItem>
			</LinkTo.Object>
		);
	}
}
