import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import Button from '../../common/Button';
import EnrollLink from '../../common/EnrollmentLink';

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
			<EnrollLink option={option}>
				<Button {...rawContent(label)} />
			</EnrollLink>
		);
	}
}
