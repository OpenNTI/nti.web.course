import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';
import {Prompt} from '@nti/web-commons';

import Button from '../../common/Button';
import EnrollLink from '../../common/EnrollmentLink';

export default class CourseEnrollmentBaseTypeEnrollButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			option: PropTypes.object.isRequired,
			getEnrollButtonLabel: PropTypes.func,
			isDisabled: PropTypes.func,
			getDisabledDescription: PropTypes.func,
			getDisabledTitle: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const label = option.getEnrollButtonLabel && option.getEnrollButtonLabel();

		if (!label) { return null; }

		const disabled = option?.isDisabled();
		const alert = (e) => {
			if (!disabled) { return; }

			e.stopPropagation();
			e.preventDefault();

			Prompt.alert(option.getDisabledDescription(), option.getDisabledTitle());
		};

		return (
			<EnrollLink option={option} onClick={alert}>
				<Button {...rawContent(label)} />
			</EnrollLink>
		);
	}
}
