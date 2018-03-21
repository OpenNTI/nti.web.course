import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Layouts} from 'nti-web-commons';

import Contents from './contents';

const {InfiniteLoad} = Layouts;

export default class ProgressOverview extends React.Component {
	static showForBatch (batch, course) {
		return new Promise ((fulfill) => {
			Prompt.modal((
				<ProgressOverview
					batch={batch}
					course={course}
					onClose={fulfill}
				/>
			), 'course-progress-overview-prompt');

		});
	}

	static showForCourse (course) {
		return new Promise ((fulfill) => {
			Prompt.modal((
				<ProgressOverview
					course={course}
					onClose={fulfill}
					singleItem
				/>
			), 'course-progress-overview-prompt');
		});
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		batch: PropTypes.bool,
		singleItem: PropTypes.bool,

		enrollment: PropTypes.object,
		totalItems: PropTypes.bool,
		currentItemIndex: PropTypes.bool,
		loadNextItem: PropTypes.func,
		loadPrevItem: PropTypes.func
	}


	render () {
		const {course} = this.props;

		const styles = {
			width: '95vw',
			height: '90vh',
			overflow: 'auto',
			background: 'white'
		};

		return (
			<InfiniteLoad.Container className="progress-overview" style={styles}>
				<Contents course={course} />
			</InfiniteLoad.Container>
		);
	}
}
