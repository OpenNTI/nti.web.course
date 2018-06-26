import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Button from '../../common/Button';

export default class CourseEnrollmentBaseTypeEnrollButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			option: PropTypes.object.isRequired,
			getDropButtonLabel: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const label = option.getDropButtonLabel && option.getDropButtonLabel();

		if (!label) { return null; }

		return (
			<LinkTo.Object object={option.option} context="drop">
				<Button caution>
					{label}
				</Button>
			</LinkTo.Object>
		);
	}
}
