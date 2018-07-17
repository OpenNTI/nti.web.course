import React from 'react';
import PropTypes from 'prop-types';

import { List } from '../../Constants';
import Registry from '../Registry';

import GridCmp from './Grid';
import ListCmp from './List';

export default
@Registry.register('application/vnd.nextthought.webinarasset')
class LessonOverviewWebinarAsset extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		layout: PropTypes.any
	}

	render () {
		const { layout, ...otherProps } = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		return (
			<Cmp layout={layout} {...otherProps}/>
		);
	}
}
