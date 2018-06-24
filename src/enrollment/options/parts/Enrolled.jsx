import React from 'react';
import PropTypes from 'prop-types';

import {getTypeFor} from '../types';

export default class CourseEnrollmentEnrolled extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			EnrolledTitle: PropTypes.element.isRequired,
			EnrolledDescription: PropTypes.element.isRequired,
			Actions: PropTypes.element,
			DropButton: PropTypes.element
		}).isRequired,
		catalogEntry: PropTypes.object.isRequired
	}

	render () {
		const {option, catalogEntry} = this.props;
		const {
			EnrolledTitle,
			EnrolledDescription,
			Actions,
			DropButton
		} = option;

		return (
			<div className="course-enrollment-options-enrolled">
				<EnrolledTitle option={option} catalogEntry={catalogEntry} />
				<EnrolledDescription option={option} catalogEntry={catalogEntry} />
				{Actions && (<Actions option={option} catalogEntry={catalogEntry} />)}
				{DropButton && (<DropButton option={option} catalogEntry={catalogEntry} />)}
			</div>
		);
	}
}