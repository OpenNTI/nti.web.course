import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from 'nti-web-commons';

import Store from './Store';
import Loading from './Loading';
import Page from './Page';

const {InfiniteLoad} = Layouts;
const PAGE_HEIGHT = 500;

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
		const {course:oldCourse} = prevProps;
		const {course:newCourse} = this.props;

		if (oldCourse !== newCourse) {
			this.setupFor(this.props);
		}
	}


	async setupFor (props) {
		const {course, enrollment} = props;

		this.setState({
			completedItems: null,
			store: new Store(course.getContentDataSource())
		});

		try {
			const completedItems = await enrollment.fetchLink('CompletedItems');

			this.setState({
				completedItems
			});
		} catch (e) {
			//its fine if it throws
		}
	}


	render () {
		if (!this.state.store) { return null; }

		return (
			<div className="progress-overview-contents">
				<InfiniteLoad.Store
					store={this.state.store}
					defaultPageHeight={PAGE_HEIGHT}
					renderPage={this.renderPage}
					renderLoading={this.renderLoading}
				/>
			</div>
		);
	}

	renderPage = (props) => {
		const {completedItems} = this.state;

		return (
			<Page {...props} course={this.props.course} completedItems={completedItems} />
		);
	}


	renderLoading = () => {
		return (
			<Loading pageHeight={PAGE_HEIGHT * 3} />
		);
	}
}

