import './Image.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {
	Presentation,
	DeferredImage
} from '@nti/web-commons';

CourseCardImage.propTypes = {
	course: PropTypes.object.isRequired
};
export default function CourseCardImage ({course}) {
	return (
		<div className="nti-course-card-image">
			<Presentation.Asset contentPackage={course} propName="src" type="landing">
				<DeferredImage alt="" />
			</Presentation.Asset>
		</div>
	);
}
