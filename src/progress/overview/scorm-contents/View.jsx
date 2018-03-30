import React from 'react';
import PropTypes from 'prop-types';

import Overview from '../../../overview/lesson/OverviewContents';
import CompletedDate from '../contents/CompletedDate';

export default class ScormProgressOverviewContents extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		enrollment: PropTypes.object
	};

	state = {
		overview: {}
	};

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		return {
			router: {
				disabled: true
			}
		};
	}

	componentDidMount () {
		this.setupFor(this.props);
	}

	compnentDidUpdate (prevProps) {
		const { course: oldCourse, enrollment: oldEnrollment } = prevProps;
		const { course: newCourse, enrollment: newEnrollment } = this.props;

		if (oldCourse !== newCourse && oldEnrollment !== newEnrollment) {
			this.setupFor(this.props);
		}
	}

	async setupFor (props) {
		const { course, enrollment } = props;

		if (!enrollment) {
			return;
		}

		try {
			const assignments = await course.getAllAssignments();

			// Need to resolve the completion since there isn't a overview
			if (assignments && assignments.length > 0) {
				assignments.forEach(assignment => assignment.updateCompletedState(enrollment));
			}

			const overview = {
				title: 'Assignments',
				Items: assignments,
			};

			this.setState({
				overview
			});
		} catch (e) {
			//its fine if it throws
		}
	}

	render () {
		const { overview } = this.state;
		const { course } = this.props;
		const shouldRenderOverview = overview && overview.Items && overview.Items.length > 0;

		return (
			<div className="progress-overview-contents">
				{shouldRenderOverview && (
					<Overview
						overview={overview}
						outlineNode={{}}
						course={course}
						layout={Overview.List}
						requiredOnly
						extraColumns={[CompletedDate]}
						readOnly
					/>
				)}
			</div>
		);
	}

}
