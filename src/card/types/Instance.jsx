import React from 'react';

import Registry from './Registry';

@Registry.register('application/vnd.nextthought.courses.courseinstance')
export default class CourseInstanceCard extends React.Component {
	render () {
		return (
			<div>
				Course Instance Card
			</div>
		);
	}
}
