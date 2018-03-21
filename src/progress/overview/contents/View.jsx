import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from 'nti-web-commons';

import Store from './Store';
import Page from './Page';

const {InfiniteLoad} = Layouts;

export default class ProgressOverviewContents extends React.Component {
	static propTypes = {
		course: PropTypes.object
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


	setupFor (props) {
		const {course} = props;

		this.setState({
			store: new Store(course.getContentDataSource())
		});
	}


	render () {
		if (!this.state.store) { return null; }

		return (
			<InfiniteLoad.Store
				store={this.state.store}
				defaultPageHeight={500}
				renderPage={this.renderPage}
			/>
		);
	}

	renderPage = (props) => {
		return (
			<Page {...props} course={this.props.course} />
		);
	}
}

