import React from 'react';

import Registry from './Registry';

@Registry.register('application/vnd.nextthought.courseware.courseinstanceadministrativerole')
export default class Administrative extends React.Component {
	render () {
		return (
			<div>
				Administrative Card
			</div>
		);
	}
}
