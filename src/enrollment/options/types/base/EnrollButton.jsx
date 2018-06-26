import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Button from '../../common/Button';

export default class CourseEnrollmentBaseTypeEnrollButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			option: PropTypes.object.isRequired,
			getEnrollButtonLabel: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const label = option.getEnrollButtonLabel && option.getEnrollButtonLabel();

		if (!label) { return null; }

		return (
			<LinkTo.Object object={option.option} context="enroll">
				<Button>
					{label}
				</Button>
			</LinkTo.Object>
		);
	}
}
