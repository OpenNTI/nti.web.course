import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Sortable from './SortableHeader';
import PercentComplete from './PercentComplete';
import styles from './Progress.css';

const cx = classnames.bind(styles);

export default class Progress extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	static HeaderComponent = props => <Sortable>Progress</Sortable>
	static cssClassName = cx('progress-cell')

	render () {
		const {item: {CourseProgress: progress} = {}} = this.props;
		const percentage = progress && progress.PercentageProgress != null ? progress.PercentageProgress : 0;
		return (
			<div><PercentComplete percentage={percentage} /></div>
		);
	}
}
