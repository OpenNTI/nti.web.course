import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import PercentComplete from './PercentComplete';
import styles from './Progress.css';

const cx = classnames.bind(styles);

const t = scoped('roster.columns.progress', {
	header: 'Progress'
});

export default class Progress extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	static Name = t('header')
	static cssClassName = cx('progress-cell')

	render () {
		const {item: {CourseProgress: progress} = {}} = this.props;
		const percentage = progress && progress.PercentageProgress != null ? progress.PercentageProgress : 0;
		return (
			<div><PercentComplete percentage={percentage} /></div>
		);
	}
}
