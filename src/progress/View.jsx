import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from 'nti-web-commons';

import Store from './Store';

const {InfiniteLoad} = Layouts;

function flatten (overview) {
	const {Items} = overview;

	return Items.reduce((acc, item) => {
		if (item.Items) {
			acc = [...acc, ...flatten(item)];
		} else {
			acc.push(item);
		}

		return acc;
	}, []);
}

export default class CourseProgress extends React.Component {
	static propTypes = {
		course: PropTypes.object
	}

	constructor (props) {
		super(props);

		const {course} = props;

		this.state = {
			store: new Store (course.getContentDataSource())
		};
	}


	render () {
		return (
			<InfiniteLoad.Store
				store={this.state.store}
				defaultPageHeight={500}
				renderPage={this.renderPage}
			/>
		);
	}


	renderPage = ({loading, page, error}) => {
		return (
			<div>
				{loading && 'loading'}
				{error && (<div style={{height: 100}}>Error</div>)}
				{page && this.renderOverview(page)}
			</div>
		);
	}


	renderOverview = (page) => {
		const overview = page.Items[0];
		const items = flatten(overview);

		return (
			<div style={{position: 'relative', 'overflow': 'hidden'}}>
				<h1>{overview.title}</h1>
				<ul>
					{items.map((item, index) => {
						return (
							<li key={index} style={{height: 100}} >
								{item.title || item.label}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
