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
		const content = this.props.catalogEntry[DescriptionView.FIELD_NAME];

		return (
			<div className="course-view-description" dangerouslySetInnerHTML={{ __html: content }}/>
		);
	}
}
