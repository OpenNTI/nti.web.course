import React from 'react';
import PropTypes from 'prop-types';

import { TabsEditor } from '../../../navigation/';

export default class TabNameEditor extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
	};

	render() {
		const { course } = this.props;

		return <TabsEditor course={course} />;
	}
}
