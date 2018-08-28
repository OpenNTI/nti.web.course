import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Button from '../../common/Button';

export default class CourseEnrollmentBaseTypeOpenButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			access: PropTypes.object.isRequired,
			getOpenButtonLabel: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const label = option.getOpenButtonLabel && option.getOpenButtonLabel();

		if (!label) { return null; }

		return (
			<LinkTo.Object object={option.access} context="open">
				<Button>
					{label}
				</Button>
			</LinkTo.Object>
		);
	}
}
