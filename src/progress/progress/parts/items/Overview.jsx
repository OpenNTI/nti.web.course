import './Overview.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Container from '../../../common/Container';

import Registry from './Registry';
import ItemsView from './View';

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

export default
@Registry.register('application/vnd.nextthought.ntilessonoverview')
class Overview extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	render () {
		const {item, ...otherProps} = this.props;
		const items = flatten(item);

		return (
			<div className="course-progress-lesson-overview">
				<Container className="overview-info">
					<div className="title">
						{item.title}
					</div>
				</Container>
				<ItemsView items={items} {...otherProps} />
			</div>
		);
	}
}
