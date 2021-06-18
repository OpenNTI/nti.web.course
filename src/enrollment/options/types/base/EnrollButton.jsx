import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';
import { Prompt, useService } from '@nti/web-commons';

import Button from '../../common/Button';
import EnrollLink from '../../common/EnrollmentLink';

const CourseEnrollmentBaseTypeEnrollButton = ({ option }) => {
	const { isAnonymous } = useService();

	const label =
		option.getEnrollButtonLabel && option.getEnrollButtonLabel(isAnonymous);

	if (!label) {
		return null;
	}

	const disabled = option?.isDisabled();
	const alert = e => {
		if (!disabled) {
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		Prompt.alert(
			option.getDisabledDescription(),
			option.getDisabledTitle()
		);
	};

	return (
		<EnrollLink option={option} onClick={alert}>
			<Button {...rawContent(label)} />
		</EnrollLink>
	);
};

CourseEnrollmentBaseTypeEnrollButton.propTypes = {
	option: PropTypes.shape({
		option: PropTypes.object.isRequired,
		getEnrollButtonLabel: PropTypes.func,
		isDisabled: PropTypes.func,
		getDisabledDescription: PropTypes.func,
		getDisabledTitle: PropTypes.func,
	}).isRequired,
};

export default function EnrollButtonWrapper(props) {
	return (
		<Suspense fallback={<div />}>
			<CourseEnrollmentBaseTypeEnrollButton {...props} />
		</Suspense>
	);
}
