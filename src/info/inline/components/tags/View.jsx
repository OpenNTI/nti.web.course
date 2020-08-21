import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class TagsView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'tags';

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderTag = (tag) => {
		return (<div key={tag} className="tag">{tag}</div>);
	}

	render () {
		return (
			<div className="course-tags">
				{(this.props.catalogEntry[TagsView.FIELD_NAME] || []).map(this.renderTag)}
			</div>
		);
	}
}
