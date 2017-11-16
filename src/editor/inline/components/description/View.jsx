import React from 'react';
import PropTypes from 'prop-types';

export default class DescriptionView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'description';

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		// prefer RichDescription if we have it, otherwise fallback to description
		let content = this.props.catalogEntry['RichDescription'];

		if(!content || content === '') {
			content = this.props.catalogEntry[DescriptionView.FIELD_NAME];
		}

		return (
			<div className="course-view-description" dangerouslySetInnerHTML={{ __html: content }}/>
		);
	}
}
