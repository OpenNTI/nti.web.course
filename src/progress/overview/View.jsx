import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Layouts, Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Header from './Header';
import Stats from './stats';
import DefaultContents from './contents';
import ScormContents from './scorm-contents';

const t = scoped('course.progress.overview.View', {
	error: 'Unable to load Progress.'
});

const {InfiniteLoad} = Layouts;

const propMap = {
	loading: 'loading',
	error: 'error',
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
	static showForBatchLink (batch, course) {
		return new Promise ((fulfill) => {
			const Cmp = this;

			Prompt.modal((
				<Cmp
					batchLink={batch}
					course={course}
					onClose={fulfill}
					modal
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
					modal
				/>
			), 'course-progress-overview-prompt');
		});
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		enrollment: PropTypes.object,
		batchLink: PropTypes.string,
		modal: PropTypes.bool,
		singleItem: PropTypes.bool,

		onClose: PropTypes.func,
		onDismiss: PropTypes.func,

		store: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.object,
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
		const {course:oldCourse, enrollment:oldEnrollment, batchLink:oldBatch} = oldProps;
		const {course:newCourse, enrollment:newEnrollment, batchLink:newBatch} = this.props;

		if (oldCourse !== newCourse || oldEnrollment !== newEnrollment || oldBatch !== newBatch) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {store, course, enrollment, batchLink} = this.props;

		if (batchLink) {
			store.loadBatchLink(batchLink);
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
		const {course, currentItem, loading, error, modal, singleItem} = this.props;
		const Contents = course.isScormInstance ? ScormContents : DefaultContents;

		const contents = (
			<div className="progress-overview">
				{modal && (<Header {...this.props} doClose={this.doClose} singleItem={singleItem} />)}
				{loading && (<div className="loading-mask"><Loading.Mask /></div>)}
				{!loading && error && (<div className="error">{t('error')}</div>)}
				{!loading && !error && (
					<React.Fragment>
						<Stats course={course} enrollment={currentItem} singleItem={singleItem}/>
						<Contents course={course} enrollment={currentItem} singleItem={singleItem}/>
					</React.Fragment>
				)}
			</div>
		);

		return modal ?
			(<InfiniteLoad.Container className="progress-overview-container">{contents}</InfiniteLoad.Container>) :
			contents;
	}
}
