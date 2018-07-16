import React from 'react';
import PropTypes from 'prop-types';

import { List } from '../../Constants';
import Registry from '../Registry';

export default
@Registry.register('application/vnd.nextthought.webinarasset')
class OverviewItemView extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		layout: PropTypes.any
	}

	render () {
		const { layout } = this.props;

		const minimal = layout === List;

		return (
			<div>
				Webinar {minimal}
			</div>
		);
	}
}
