import React from 'react';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';

import {List, Grid} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

function isNetworkError (e) {
	return e && (e.statusCode === 0 || e.statusCode >= 500);
}

const SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

const HANDLES = [
	'application/vnd.nextthought.naquestionref',
	'application/vnd.nextthought.questionsetref',
	'application/vnd.nextthought.nanosubmitassignment',
	'application/vnd.nextthought.naassignment',
	'application/vnd.nextthought.assignment',
	'application/vnd.nextthought.assignmentref'
];

export default
@Registry.register(HANDLES)
class LessonOverviewQuestionSet extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,

		layout: PropTypes.oneOf([Grid, List])
	}

	state = {}


	componentWillReceiveProps (nextProps) {
		const {item:newItem, course:newCourse} = nextProps;
		const {item:oldItem, course:oldCourse} = this.props;

		if (newItem !== oldItem || newCourse !== oldCourse) {
			this.setupFor(nextProps);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	async setupFor (props) {
		const {item, course} = this.props;
		const target = item['Target-NTIID'] || (item.getID ? item.getID() : item.NTIID);

		try {
			const collection = await course.getAssignments();

			if (collection.isAssignment(target)) {
				this.setupAssignment(target, collection);
			} else {
				this.setupAssessment(target, collection);
			}
		} catch (e) {
			//TODO: figure out what to do here is anything
		}
	}


	async setupAssignment (id, collection) {
		try {
			const assignment = await collection.fetchAssignment(id);

			this.setState({
				assignment,
				networkError: false
			}, async () => {
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
			});
		} catch (e) {
			//TODO: figure out if/how we need to handle this case
		}

	}


	setupAssessment (id, collection) {
		const assessment = collection.getAssessment(id);

		this.setState({
			assessment,
			networkError: false
		}, async () => {
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
