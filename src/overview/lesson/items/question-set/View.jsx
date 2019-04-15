import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Events, Hooks} from '@nti/web-session';

import {List, Grid} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

function isNetworkError (e) {
	return e && (e.statusCode === 0 || e.statusCode >= 500);
}

const SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

const HANDLES = [
	'application/vnd.nextthought.naquestionset',
	'application/vnd.nextthought.naquestionref',
	'application/vnd.nextthought.questionsetref',
	'application/vnd.nextthought.nanosubmitassignment',
	'application/vnd.nextthought.naassignment',
	'application/vnd.nextthought.assignment',
	'application/vnd.nextthought.assignmentref',
	'application/vnd.nextthought.assessment.assignment'
];

export default
@Registry.register(HANDLES)
@Hooks.onEvent({
	[Events.ASSIGNMENT_SUBMITTED]: 'onAssignmentSubmitted',
	[Events.ASSESSMENT_SUBMITTED]: 'onAssessmentSubmitted'
})
class LessonOverviewQuestionSet extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,

		layout: PropTypes.oneOf([Grid, List]),

		readOnly: PropTypes.bool
	}

	state = {}


	onAssignmentSubmitted (submitted) {
		const {assignment} = this.state;

		if (assignment && assignment.getID() === submitted.getID()) {
			this.setupFor(this.props);
		}
	}


	onAssessmentSubmitted (submitted) {
		const {assessment} = this.state;

		if (assessment && assessment.getID() === submitted.getID()) {
			this.setupFor(this.props);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		this.unmounted = true;
		this.setState = () => {};
	}


	componentDidUpdate (prevProps) {
		const {item:newItem, course:newCourse} = this.props;
		const {item:oldItem, course:oldCourse} = prevProps;

		if (newItem !== oldItem || newCourse !== oldCourse) {
			this.setupFor(this.props);
		}
	}


	async setupFor (props = this.props) {
		const {item, course} = props;
		const target = item['Target-NTIID'] || (item.getID ? item.getID() : item.NTIID);

		if (item.MimeType === 'application/vnd.nextthought.assignmentref') {
			return this.setupAssignmentRef(target, course);
		}

		try {
			const collection = await course.getAssignments();

			if (collection.isAssignment(target)) {
				this.setupAssignment(target, collection, item);
			} else {
				this.setupAssessment(target, collection, item);
			}
		} catch (e) {
			//TODO: figure out what to do here is anything
		}
	}


	async setupAssignmentRef (id, course) {
		try {
			const assignment = await course.getAssignment(id);

			this.setState({
				assignment,
				networkError: false
			});

			try {
				const history = await assignment.loadHistory();

				this.setState({
					assignmentHistory: history
				});
			} catch (e) {
				if (isNetworkError(e)) {
					this.setNetworkError();
				}
			}
		} catch (e) {
			//TODO: figure out if/how we need to handle this case
		}
	}


	async setupAssignment (id, collection) {
		const {readOnly} = this.props;

		try {
			const assignment = readOnly ?
				await collection.getAssignment(id) :
				await collection.fetchAssignment(id);

			this.setState({
				assignment: assignment,
				networkError: false
			});

			if (readOnly) {
				return;
			}

			try {
				const history = await assignment.loadHistory();

				this.setState({
					assignmentHistory: history
				});
			} catch (e) {
				if (isNetworkError(e)) {
					this.setNetworkError();
				}
				//its fine if we can't load the history
			}

		} catch (e) {
			//TODO: figure out if/how we need to handle this case
		}

	}


	setupAssessment (id, collection) {
		const {readOnly} = this.props;
		const assessment = collection.getAssessment(id);

		this.setState({
			assessment,
			networkError: false
		}, async () => {
			if (readOnly) { return; }

			try {
				const service = await getService();
				const pageInfo = await service.getPageInfo(id);
				const submission = await pageInfo.getUserDataLastOfType(SUBMITTED_QUIZ);

				this.setState({
					assessmentSubmission: submission
				});
			} catch (e) {
				if (isNetworkError(e)) {
					this.setNetworkError();
				}

				//its fine if we can't load a submission
			}
		});
	}


	setNetworkError () {
		this.setState({
			networkError: true
		});
	}


	render () {
		const {layout, ...otherProps} = this.props;
		const {assignment, assignmentHistory, assessment, assessmentSubmission} = this.state;
		const extraProps = {assignment, assignmentHistory, assessment, assessmentSubmission};

		const Cmp = layout === List ? ListCmp : GridCmp;

		return (
			<Cmp layout={layout} {...otherProps} {...extraProps} />
		);
	}
}
