import React from 'react';
import PropTypes from 'prop-types';

import {Grid, List} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

export default
@Registry.register('application/vnd.nextthought.ntivideo')
class LessonOverviewGroup extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([Grid, List])
	}

	render () {
		const {layout, ...otherProps} = this.props;

		return layout === List ?
			(<ListCmp layout={layout} {...otherProps} />) :
			(<GridCmp layout={layout} {...otherProps} />);
	}
}
