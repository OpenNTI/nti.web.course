import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';

const LABELS = {
	label: 'About This Course'
};

const t = scoped('components.course.editor.inline.components.description.edit', LABELS);

export default class DescriptionEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'description';

	constructor (props) {
		super(props);

		this.state = { value: props.catalogEntry.description };
	}

	onChange = (val) => {
		const { onValueChange } = this.props;

		this.setState({value: val});

		onValueChange && onValueChange(DescriptionEdit.FIELD_NAME, val);
	}

	render () {
		return (
			<div className="description-editor">
				<div className="label">{t('label')}</div>
				<Input.TextArea className="description-input" onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
}
