import React from 'react';
import PropTypes from 'prop-types';

import {List, Grid} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

export default
@Registry.register('application/vnd.nextthought.questionsetref')
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
		const target = item['Target-NTIID'];

		try {
			const collection = await course.getAssignments();

			if (collection.isAssignment(target, collection)) {
				this.setupAssignment(target, collection);
			} else {
				this.setupAssessment(target, collection);
			}
		} catch (e) {
			//TODO: figure out what to do here is anything
		}
	}


	setupAssignment (id, collection) {
		const assignment = collection.getAssignment(id);

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
				if (e && (e.statusCode === 0 || e.statusCode >= 500)) {
					this.setNetworkError();
				}

				//its fine if we can't load the history
			}
		});
	}


	setupAssessment (id, collection) {
		//TODO: fill this out
	}


	setNetworkError () {
		this.setState({
			networkError: true
		});
	}


	render () {
		const {layout, ...otherProps} = this.props;
		const {assignment, assignmentHistory} = this.state;
		const extraProps = {assignment, assignmentHistory};

		return layout === List ?
			(<ListCmp layout={layout} {...otherProps} {...extraProps} />) :
			(<GridCmp layout={layout} {...otherProps} {...extraProps} />);
	}
}
