import React from 'react';
import {Layouts} from 'nti-web-commons';

import Carousel from './Carousel';
import Playlist from './Playlist';

const {Responsive} = Layouts;

export default function LessonOverviewVideoRollGrid (props) {
	const View = Responsive.isMobileContext() ? Carousel : Playlist;

	return (
		<View {...props}/>
	);
}
