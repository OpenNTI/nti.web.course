import React from 'react';

import Registry from './Registry';

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
export default class EnrollmentCard extends React.Component {
	render () {
		return (
			<div>
				Enrollment Card
			</div>
		);
	}
}
