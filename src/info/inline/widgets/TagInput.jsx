import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Input } from '@nti/web-commons';
import { getService } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';

import Styles from './TagInput.css';
import { validateTag } from './utils';

const cx = classnames.bind(Styles);
const t = scoped('course.info.inline.widgets.TagInput', {
	placeholder: {
		empty: 'Choose a category',
		hasTokens: 'Add more categories',
	},
	suggestionsLabel: 'Choose a Category',
});

const SUGGESTED_REL = 'SuggestedTags';

export default class CourseTagInput extends React.Component {
	static propTypes = {
		value: PropTypes.array,
		onChange: PropTypes.func,
	};

	state = {};

	onChange = value => {
		const { onChange } = this.props;

		if (onChange) {
			onChange(value);
		}
	};

	getSuggestions = async match => {
		const started = new Date();

		this.lastSuggestionStart = started;

		await new Promise((fulfill, reject) => {
			setTimeout(() => {
				if (this.lastSuggestionStart === started) {
					fulfill();
				} else {
					reject('Interrupted');
				}
			}, 250);
		});

		const service = await getService();
		const collection = service.getCollection('Courses', 'Catalog');

		if (!collection || !collection.hasLink(SUGGESTED_REL)) {
			return null;
		}

		const suggestions = await collection.fetchLink(
			SUGGESTED_REL,
			match ? { filter: match } : null
		);

		return suggestions ? suggestions.Items.map(s => s.toUpperCase()) : null;
	};

	validateTag = value => {
		const valid = validateTag(value);

		return {
			message: valid[0],
			isValid: valid.length === 0,
		};
	};

	inputTransform = value => value.toUpperCase();

	render() {
		const { value } = this.props;

		return (
			<Input.Tokens
				className={cx('course-tag-editor')}
				value={value}
				onChange={this.onChange}
				placeholder={{
					empty: t('placeholder.empty'),
					hasTokens: t('placeholder.hasTokens'),
				}}
				suggestionsLabel={t('suggestionsLabel')}
				light
				allowNewTokens={Input.Tokens.ALLOW_EXPLICIT}
				getSuggestions={this.getSuggestions}
				maxTokenLength={64}
				validator={this.validateTag}
				inputTransform={this.inputTransform}
			/>
		);
	}
}

// class xTagInput extends React.Component {
// 	static propTypes = {
// 		value: PropTypes.array,
// 		onChange: PropTypes.func
// 	}

// 	attachFlyoutRef = x => this.flyout = x

// 	constructor (props) {
// 		super(props);

// 		this.state = {};
// 	}

// 	onChange = (values) => {
// 		this.props.onChange && this.props.onChange(values);
// 	}

// 	suggestionProvider = (val) => {
// 		return getService().then(service => {
// 			const links = service.getCollection('Courses', 'Catalog').Links.filter(x => x.rel === 'SuggestedTags');

// 			if(links.length === 0) {
// 				return Promise.reject('No SuggestedTags link');
// 			}

// 			return service.get(links[0].href + '?filter=' + val).then((resp) => {
// 				return resp.Items;
// 			});
// 		});
// 	}

// 	validator = (value) => {
// 		return validateTag(value);
// 	}

// 	render () {
// 		const { value } = this.props;

// 		return (
// 			<div className="course-tag-editor">
// 				<TokenEditor
// 					value={value}
// 					onChange={this.onChange}
// 					placeholder={value && value.length > 0 ? 'Add more categories' : 'Add categories'}
// 					tokenDelimiterKeys={DELIMITER_KEYS}
// 					suggestionProvider={this.suggestionProvider}
// 					validator={this.validator}
// 					maxTokenLength={64}/>
// 			</div>
// 		);
// 	}
// }
