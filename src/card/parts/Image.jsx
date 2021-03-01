import './Image.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Presentation, Image } from '@nti/web-commons';

CourseCardImage.propTypes = {
	course: PropTypes.object.isRequired,
	type: PropTypes.string,
};
export default function CourseCardImage({ course, type = 'landing' }) {
	return (
		<div className="nti-course-card-image">
			<Presentation.Asset contentPackage={course} type={type}>
				<Image.Deferred alt="" />
			</Presentation.Asset>
		</div>
	);
}
