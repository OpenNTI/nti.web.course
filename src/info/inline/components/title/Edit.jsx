import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';

const LABELS = {
	label: 'Course Title',
	titleIsRequired: 'Title is required'
};

const t = scoped('components.course.editor.inline.components.title.edit', LABELS);

export default class TitleEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
		error: PropTypes.object
	}

	static FIELD_NAME = 'title';

	constructor (props) {
		super(props);

		this.state = { value: props.catalogEntry[TitleEdit.FIELD_NAME] };
	}

	onChange = (val) => {
		const { onValueChange } = this.props;

		this.setState({value: val});

		onValueChange && onValueChange(TitleEdit.FIELD_NAME, val);
	}

	renderError () {
		const { error } = this.props;

		if(error) {
			// TODO: Come up with a higher level, more generic error mapping scheme
			return <div className="error">{t('titleIsRequired')}</div>;
		}
	}

	render () {
		return (
			<div className="title-editor">
				{this.renderError()}
				<div className="label">{t('label')}</div>
				<Input.Text className="title-input" onChange={this.onChange} value={this.state.value} maxLength="140"/>
			</div>
		);
	}
}
