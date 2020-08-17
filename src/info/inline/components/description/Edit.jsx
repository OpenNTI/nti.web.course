import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Common} from '@nti/web-editor';

const t = scoped('course.info.inline.components.description.Edit', {
	label: 'About This Course'
});

export default class DescriptionEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'RichDescription';

	constructor (props) {
		super(props);

		// prefer RichDescription if we have it, otherwise fallback to description
		let content = props.catalogEntry[DescriptionEdit.FIELD_NAME];

		if(!content || content === '') {
			content = props.catalogEntry['description'];
		}

		this.state = { value: content };
	}

	onChange = (val) => {
		const { onValueChange } = this.props;

		this.setState({value: val});

		onValueChange && onValueChange(DescriptionEdit.FIELD_NAME, val ?? '');
	}

	render () {
		return (
			<div className="description-editor">
				<div className="label">{t('label')}</div>
				<Common.RichText value={this.state.value} onContentChange={this.onChange} contentChangeBuffer={100} />
			</div>
		);
	}
}
