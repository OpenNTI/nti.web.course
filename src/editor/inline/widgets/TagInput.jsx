import React from 'react';
import PropTypes from 'prop-types';
import {TokenEditor} from 'nti-web-commons';
import {getService} from 'nti-web-client';

export default class TagInput extends React.Component {
	static propTypes = {
		value: PropTypes.array,
		onChange: PropTypes.func
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	onChange = (values) => {
		this.props.onChange && this.props.onChange(values);
	}

	suggestionProvider = (val) => {
		return getService().then(service => {
			const links = service.getCollection('Courses', 'Catalog').Links.filter(x => x.rel === 'SuggestedTags');

			if(links.length === 0) {
				Promise.reject('No SuggestedTags link');
			}

			return service.get(links[0].href + '?filter=' + val).then((resp) => {
				return resp.Items;
			});
		});
	}

	render () {
		const { value } = this.props;

		return (
			<div className="course-tag-editor">
				<TokenEditor
					value={value}
					onChange={this.onChange}
					placeholder={value && value.length > 0 ? 'Add more categories' : 'Add categories'}
					suggestionProvider={this.suggestionProvider}/>
			</div>
		);
	}
}
