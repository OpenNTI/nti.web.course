import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import { encodeForURI } from '@nti/lib-ntiids';

import Registry from '../Registry';

/**
 * This is not to be confused with Forum topics.
 * The "Topic" here references the <topic> tag in the legacy ToC xml.
 * This is is just a flat link to content.
 */
export default class LessonOverviewTopic extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		const {
			props: { item },
		} = this;

		//TODO: implement path resolution
		let link = path.join('.', 'content', encodeForURI(item.NTIID), '');

		return (
			<div>
				<a href={link}>{item.label}</a>
			</div>
		);
	}
}

Registry.register('application/vnd.nextthought.topic')(LessonOverviewTopic);
