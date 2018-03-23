import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Layouts} from 'nti-web-commons';

import Store from './Store';
import Header from './Header';
import Stats from './stats';
import Contents from './contents';

const {InfiniteLoad} = Layouts;

const propMap = {
	currentItem: 'currentItem',
	totalItems: 'totalItems',
	currentItemIndex: 'currentItemIndex',
	hasNextItem: 'hasNextItem',
	hasPrevItem: 'hasPrevItem',
	loadNextItem: 'loadNextItem',
	loadPrevItem: 'loadPrevItem'
};

export default
@Store.connect(propMap)
class ProgressOverview extends React.Component {
	static showForBatch (batch, course) {
		return new Promise ((fulfill) => {
			const Cmp = this;

			Prompt.modal((
				<Cmp
					batch={batch}
					course={course}
					onClose={fulfill}
				/>
			), 'course-progress-overview-prompt');

		});
	}

	static showForCourse (course) {
		return new Promise ((fulfill) => {
			const Cmp = this;

			Prompt.modal((
				<Cmp
					course={course}
					onClose={fulfill}
					singleItem
				/>
			), 'course-progress-overview-prompt');
		});
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		enrollment: PropTypes.object,
		batch: PropTypes.bool,
		singleItem: PropTypes.bool,

		onClose: PropTypes.func,
		onDismiss: PropTypes.func,

		store: PropTypes.object,
		currentItem: PropTypes.object,
		totalItems: PropTypes.number,
		currentItemIndex: PropTypes.number,
		hasNextItem: PropTypes.bool,
		hasPrevItem: PropTypes.bool,
		loadNextItem: PropTypes.func,
		loadPrevItem: PropTypes.func
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (oldProps) {
		const {course:oldCourse, enrollment:oldEnrollment, batch:oldBatch} = oldProps;
		const {course:newCourse, enrollment:newEnrollment, batch:newBatch} = this.props;

		if (oldCourse !== newCourse || oldEnrollment !== newEnrollment || oldBatch !== newBatch) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {store, course, enrollment, batch} = this.props;

		if (batch) {
			store.loadBatch(batch);
		} else if (course) {
			store.loadCourse(enrollment, course);
		}
	}


	doClose = () => {
		const {onClose, onDismiss} = this.props;

		if (onDismiss) { onDismiss(); }
		if (onClose) { onClose(); }
	}


	render () {
		const {course, currentItem} = this.props;


		return (
			<InfiniteLoad.Container className="progress-overview-container">
				<div className="progress-overview">
					<Header {...this.props} doClose={this.doClose} />
					<Stats course={course} enrollment={currentItem} />
					<Contents course={course} enrollment={currentItem} />
				</div>
			</InfiniteLoad.Container>
		);
	}
}
