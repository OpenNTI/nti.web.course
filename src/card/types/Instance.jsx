import React from 'react';

import Registry from './Registry';

export default class CourseInstanceCard extends React.Component {
	render() {
		return <div>Course Instance Card</div>;
	}
}

Registry.register('application/vnd.nextthought.courses.courseinstance')(
	CourseInstanceCard
);
