import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class TitleView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'title';

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		return (
			<div className="course-view-title">{this.props.catalogEntry[TitleView.FIELD_NAME]}</div>
		);
	}
}
