import React from 'react';
import PropTypes from 'prop-types';

import { Layouts } from '@nti/web-commons';

import AdminProgress from './AdminProgress';
import NoProgress from './NoProgress';
import StudentProgress from './StudentProgress';

const Types = [AdminProgress, StudentProgress, NoProgress];

CourseOutlineHeader.propTypes = {
	course: PropTypes.shape({
		CompletionPolicy: PropTypes.object,
		PreferredAccess: PropTypes.object,
	}).isRequired,
};
export default function CourseOutlineHeader(props) {
	const { course } = props;
	const Cmp = Types.find(t => t.handles(course)) ?? NoProgress;
	const inlineCertificatePreview = Layouts.Responsive.isWebappContext();

	return <Cmp {...{ ...props, inlineCertificatePreview }} />;
}
