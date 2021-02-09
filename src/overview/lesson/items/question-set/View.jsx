import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
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

async function getAssessmentSubmission (id) {
	if (typeof id !== 'string') {return;}
	const service = await getService();
	const pageInfo = await service.getPageInfo(id);
	const submission = await pageInfo.getUserDataLastOfType(SUBMITTED_QUIZ);

	return submission;
}

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
			this.setup(this.props);
		}
	}


	onAssessmentSubmitted (submitted) {
		const {assessment} = this.state;

		if (assessment && assessment.getID() === submitted.getID()) {
			this.setup(this.props);
		}
	}


	componentDidMount () {
		this.setup(this.props);
	}


	componentWillUnmount () {
		this.unmounted = true;
		this.setState = () => {};
	}


	componentDidUpdate (prevProps) {
		const {item:newItem, course:newCourse} = this.props;
		const {item:oldItem, course:oldCourse} = prevProps;

		if (newItem !== oldItem || newCourse !== oldCourse) {
			this.setup(this.props);
		}
	}


	async setup (props = this.props) {
		const {item, course} = props;
		const target = item['Target-NTIID'] || (item.getID ? item.getID() : item.NTIID);

		this.setState({
			assignment: null,
			assignmentHistory: null,
			assessment: null,
			assessmentSubmission: null,
			networkError: null
		});

		if (item.MimeType === 'application/vnd.nextthought.assignmentref') {
			return this.setupAssignmentRef(target, course);
		}

		if (item.MimeType === 'application/vnd.nextthought.questionsetref') {
			return this.setupQuestionSetRef(target, course);
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


	/**
	 * @param {string|Assignment} target - the assessment id or the assignment instance.
	 * @returns {void}
	 */
	async setupHistory (target) {
		if (this.props.readOnly) { return; }

		try {

			const history = await target?.loadHistory?.();
			const submission = await getAssessmentSubmission(target);

			this.setState({
				assignmentHistory: history,
				assessmentSubmission: submission
			});
		} catch (e) {
			if (isNetworkError(e)) {
				this.setNetworkError();
			}

			//its fine if we can't load a submission
		}

	}


	async setupAssignmentRef (id, course) {
		const {item} = this.props;
		try {
			let assignment = await course.getAssignment(id);
			if (item?.CompletedItem) {
				assignment = Object.create(assignment);
				Object.defineProperty(assignment, 'CompletedItem', {value: item.CompletedItem});
			}

			this.setState({
				assignment,
				networkError: false
			});

			await this.setupHistory(assignment);
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

			await this.setupHistory(assignment);

		} catch (e) {
			//TODO: figure out if/how we need to handle this case
		}
	}

	async setupQuestionSetRef (id, course) {

		try {
			const assessment = await course.getAssessment(id);

			this.setState({
				assessment,
				networkError: false
			}, () => this.setupHistory(id));
		} catch (e) {
			//TODO figure out if/how we need to handle this
		}
	}


	setupAssessment (id, collection) {
		const assessment = collection.getAssessment(id);

		this.setState({
			assessment,
			networkError: false
		}, () => this.setupHistory(id));
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

export default decorate(LessonOverviewQuestionSet, [
	Registry.register(HANDLES),
	Hooks.onEvent({
		[Events.ASSIGNMENT_SUBMITTED]: 'onAssignmentSubmitted',
		[Events.ASSESSMENT_SUBMITTED]: 'onAssessmentSubmitted'
	})
]);
