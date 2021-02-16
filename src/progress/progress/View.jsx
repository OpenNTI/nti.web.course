import React from 'react';
import PropTypes from 'prop-types';
import { Layouts } from '@nti/web-commons';

import Store from './Store';
import Page from './parts/Page';

const { InfiniteLoad } = Layouts;

export default class CourseProgress extends React.Component {
	static propTypes = {
		course: PropTypes.object,
	};

	constructor(props) {
		super(props);

		const { course } = props;

		this.state = {
			store: new Store(course.getContentDataSource()),
		};
	}

	render() {
		return (
			<InfiniteLoad.Store
				store={this.state.store}
				defaultPageHeight={500}
				renderPage={this.renderPage}
			/>
		);
	}

	renderPage = props => {
		return <Page {...props} course={this.props.course} />;
	};
}
