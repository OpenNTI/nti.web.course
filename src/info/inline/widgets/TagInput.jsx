import React from 'react';
import PropTypes from 'prop-types';
import {TokenEditor} from 'nti-web-commons';
import {getService} from 'nti-web-client';

const DELIMITER_KEYS = ['Enter', 'Tab', ','];

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
				return Promise.reject('No SuggestedTags link');
			}

			return service.get(links[0].href + '?filter=' + val).then((resp) => {
				return resp.Items;
			});
		});
	}

	validator = (value) => {
		let errors = new Set();

		if(!value) {
			return Array.from(errors); // should this count as invalid?
		}

		const parts = value.trim().split('/');

		const regex = /\.$|\.{2,}/;

		if(parts.length > 1) {
			errors.add('\'/\' characters are not allowed');
		}

		const areAllValid = parts.every(x => {
			const remaining = x.replace(/(^[.\s]+)|([.\s]+$)/g, '');

			return !regex.test(x) && remaining.length > 0;
		});

		if(!areAllValid) {
			errors.add('Invalid tag name');
		}

		return Array.from(errors);
	}

	render () {
		const { value } = this.props;

		return (
			<div className="course-tag-editor">
				<TokenEditor
					value={value}
					onChange={this.onChange}
					placeholder={value && value.length > 0 ? 'Add more categories' : 'Add categories'}
					tokenDelimiterKeys={DELIMITER_KEYS}
					suggestionProvider={this.suggestionProvider}
					validator={this.validator}
					maxTokenLength="64"/>
			</div>
		);
	}
}
