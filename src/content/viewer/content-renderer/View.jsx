import React from 'react';

import {getCmpFor} from './types';

export default class ContentViewer extends React.Component {
	render () {
		const Cmp = getCmpFor(this.props);

		if (!Cmp) { return null; }

		return (
			<Cmp {...this.props} />
		);
	}
}
