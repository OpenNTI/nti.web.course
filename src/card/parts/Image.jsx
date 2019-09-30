import React from 'react';
import PropTypes from 'prop-types';
import {Presentation} from '@nti/web-commons';

CourseCardImage.propTypes = {
	course: PropTypes.object.isRequired
};
export default function CourseCardImage ({course}) {
	return (
		<div className="nti-course-card-image">
			<Presentation.Asset contentPackage={course} propName="src" type="landing">
				<img alt="" />
			</Presentation.Asset>
		</div>
	);
}
