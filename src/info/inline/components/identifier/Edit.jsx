import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';


const t = scoped('course.info.inline.components.identifier.Edit', {
	label: 'Course Identifier',
	titleIsRequired: 'Identifier is required'
});

export default class IdentifierEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
		error: PropTypes.string
	}

	static FIELD_NAME = 'ProviderUniqueID';

	constructor (props) {
		super(props);

		this.state = { value: props.catalogEntry[IdentifierEdit.FIELD_NAME] };
	}

	onChange = (val) => {
		const { onValueChange } = this.props;

		this.setState({value: val});

		onValueChange && onValueChange(IdentifierEdit.FIELD_NAME, val);
	}

	renderError () {
		const { error } = this.props;

		if(error) {
			return <div className="error">{t('titleIsRequired')}</div>;
		}
	}

	render () {
		return (
			<div className="identifier-editor">
				{this.renderError()}
				<div className="label">{t('label')}</div>
				<Input.Text className="identifier-input" onChange={this.onChange} value={this.state.value} maxLength="140"/>
			</div>
		);
	}
}
