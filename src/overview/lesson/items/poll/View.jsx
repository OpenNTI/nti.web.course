import React from 'react';

import Registry from '../Registry';

//TODO: figure out how to handle polls in the overview

export default class LessonOverviewPoll extends React.Component {
	render() {
		return null;
	}
}

Registry.register('application/vnd.nextthought.pollref')(LessonOverviewPoll);
