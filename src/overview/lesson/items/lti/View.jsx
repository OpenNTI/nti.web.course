import React from 'react';
import PropTypes from 'prop-types';

import { List, Grid } from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

export default
@Registry.register('application/vnd.nextthought.ltiexternaltoolasset')
class LTIExternalToolAsset extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([Grid, List])
	}

	render () {
		const { layout, ...otherProps } = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		return (
			<Cmp layout={layout} {...otherProps} />
		);
	}
}
