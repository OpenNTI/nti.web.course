import React from 'react';
import PropTypes from 'prop-types';

import Sortable from './SortableHeader';
import PercentComplete from './PercentComplete';

export default class Progress extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	static HeaderComponent = props => <Sortable>Progress</Sortable>

	render () {
		const {item: {CourseProgress: progress} = {}} = this.props;
		const percentage = progress && progress.PercentageProgress != null ? progress.PercentageProgress : 0;
		return (
			<div><PercentComplete percentage={percentage} /></div>
		);
	}
}
