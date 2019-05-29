import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import TagInput from '../../widgets/TagInput';


const t = scoped('course.info.inline.components.tags.Edit', {
	label: 'Categories'
});

export default class TagsEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'tags';

	constructor (props) {
		super(props);

		this.state = { values: props.catalogEntry[TagsEdit.FIELD_NAME].map(x => x.toUpperCase()) };
	}

	onChange = (values) => {
		const { onValueChange } = this.props;

		this.setState({values: values});

		onValueChange && onValueChange(TagsEdit.FIELD_NAME, values);
	}

	render () {
		return (
			<div className="tags-editor">
				<div className="label">{t('label')}</div>
				<div>
					<TagInput value={this.state.values} onChange={this.onChange}/>
				</div>
			</div>
		);
	}
}
