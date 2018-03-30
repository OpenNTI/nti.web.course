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
		completedItems: [],
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
		const { course: oldCourse } = prevProps;
		const { course: newCourse } = this.props;

		if (oldCourse !== newCourse) {
			this.setupFor(this.props);
		}
	}

	async setupFor (props) {
		const { course, enrollment } = props;

		try {
			const completedItems = await enrollment.fetchLink('CompletedItems');
			const assignments = await course.getAllAssignments();
			const overview = {
				title: 'Assignments',
				Items: assignments,
			};

			this.setState({
				completedItems,
				overview
			});
		} catch (e) {
			//its fine if it throws
		}
	}

	render () {
		const { overview, completedItems } = this.state;
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
						requiredOnly={true}
						completedItems={completedItems}
						extraColumns={[CompletedDate]}
					/>
				)}
			</div>
		);
	}

}
