import React from 'react';
import {Layouts} from 'nti-web-commons';

import Carousel from './Carousel';

const {Responsive} = Layouts;

export default function LessonOverviewVideoRollGrid (props) {
	const View = Responsive.isMobileContext() ? Carousel : Carousel; //desktop will have a different version

	return (
		<View {...props}/>
	);
}
