import React from 'react';
import PropTypes from 'prop-types';

import {List, Grid} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

export default
@Registry.register('application/vnd.nextthought.relatedworkref')
class LessonOverviewRelatedWork extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([List, Grid])
	}

	render () {
		const {layout, ...otherProps} = this.props;

		return layout === List ?
			(<ListCmp layout={layout} {...otherProps} />) :
			(<GridCmp layout={layout} {...otherProps} />);
	}
}