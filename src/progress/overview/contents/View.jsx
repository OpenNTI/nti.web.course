import React from 'react';
import PropTypes from 'prop-types';
import {Layouts, EmptyState} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Store from './Store';
import Loading from './Loading';
import Page from './Page';

const t = scoped('course.progress.overview.content.View', {
	empty: 'There are no completable items in this course.'
});

const {InfiniteLoad} = Layouts;
const PAGE_HEIGHT = 210;

export default class ProgressOverviewContents extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		enrollment: PropTypes.object
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}

	compnentDidUpdate (prevProps) {
		const {course:oldCourse, enrollment:oldEnrollment} = prevProps;
		const {course:newCourse, enrollment:newEnrollment} = this.props;

		if (oldCourse !== newCourse || oldEnrollment !== newEnrollment) {
			this.setupFor(this.props);
		}
	}


	async setupFor (props) {
		const {course} = props;

		this.setState({
			store: new Store(course.getContentDataSource())
		});
	}


	render () {
		if (!this.state.store) { return null; }

		return (
			<div className="progress-overview-contents">
				<InfiniteLoad.Store
					store={this.state.store}
					buffer={3}
					defaultPageHeight={PAGE_HEIGHT}
					renderPage={this.renderPage}
					renderLoading={this.renderLoading}
					renderError={this.renderEmpty}
					renderEmpty={this.renderEmpty}
				/>
			</div>
		);
	}

	renderPage = (props) => {
		const {course, enrollment} = this.props;

		return (
			<Page {...props} course={course} enrollment={enrollment} />
		);
	}


	renderLoading = () => {
		return (
			<Loading pageHeight={PAGE_HEIGHT * 3} />
		);
	}


	renderEmpty = () => {
		return (
			<EmptyState header={t('empty')} />
		);
	}
}

