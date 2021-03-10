import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Failed from './Failed';

const t = scoped(
	'course.scorm.collection.components.package.ProcessingFailed',
	{
		defaultMessage: 'Unable to process SCORM package.',
	}
);

ProcessingFailedPackage.propTypes = {
	package: PropTypes.object.isRequired,
};
export default function ProcessingFailedPackage(props) {
	const { package: pack } = props;

	return (
		<Failed {...props} error={pack.errorMessage || t('defaultMessage')} />
	);
}
