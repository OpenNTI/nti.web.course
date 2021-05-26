import React from 'react';
import PropTypes from 'prop-types';

import { Presentation, Image } from '@nti/web-commons';

const ImageBox = styled.div`
	overflow: hidden;

	img {
		display: block;
		min-width: 100%;
		width: auto;
		height: 100%;
		transform: scale(1);
		opacity: 1;
		transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
	}
`;

CourseCardImage.propTypes = {
	course: PropTypes.object.isRequired,
	type: PropTypes.string,
};
export default function CourseCardImage({ course, type = 'landing' }) {
	return (
		<ImageBox className="nti-course-card-image">
			<Presentation.Asset contentPackage={course} type={type}>
				<Image.Deferred alt="" />
			</Presentation.Asset>
		</ImageBox>
	);
}
