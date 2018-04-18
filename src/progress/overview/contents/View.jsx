import React from 'react';
import PropTypes from 'prop-types';
import {Layouts, EmptyState, Checkbox} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Store from './Store';
import Loading from './Loading';
import Page from './Page';

const t = scoped('course.progress.overview.content.View', {
	empty: 'There are no completable items in this course.',
	requiredFilter: 'Only Required'
});

const {InfiniteLoad} = Layouts;
const PAGE_HEIGHT = 210;

export default class ProgressOverviewContents extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		enrollment: PropTypes.object
	}

	state = {requiredOnly: false}

	componentDidMount () {
		this.setupFor(this.props, this.state);
	}

	compnentDidUpdate (prevProps, prevState) {
		const {course:oldCourse, enrollment:oldEnrollment} = prevProps;
		const {course:newCourse, enrollment:newEnrollment} = this.props;

		if (oldCourse !== newCourse || oldEnrollment !== newEnrollment) {
			this.setupFor(this.props, this.state);
		}
	}


	async setupFor (props, state) {
		const {course} = props;
		const {requiredOnly} = state;

		this.setState({
			store: new Store(course.getContentDataSource(), null, requiredOnly)
		});
	}


	onRequiredChanged = (e) => {
		const {requiredOnly} = this.state;

		if (requiredOnly !== e.target.checked) {
			this.setState({
				requiredOnly: e.target.checked,
				store: null
			}, () => {
				this.setupFor(this.props, this.state);
			});
		}
	}


	render () {
		const {store, requiredOnly} = this.state;

		if (!store) { return null; }

		return (
			<div className="progress-overview-contents">
				<PaddedContainer className="progress-overview-contents-controls">
					<div className="required-filter">
						<Checkbox label={t('requiredFilter')} onChange={this.onRequiredChanged} checked={requiredOnly} />
					</div>
				</PaddedContainer>
				{store && (
					<InfiniteLoad.Store
						store={store}
						buffer={3}
						defaultPageHeight={PAGE_HEIGHT}
						renderPage={this.renderPage}
						renderLoading={this.renderLoading}
						renderError={this.renderEmpty}
						renderEmpty={this.renderEmpty}
					/>
				)}
			</div>
		);
	}

	renderPage = (props) => {
		const {course, enrollment} = this.props;
		const {requiredOnly} = this.state;

		return (
			<Page {...props} course={course} enrollment={enrollment} requiredOnly={requiredOnly} />
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

