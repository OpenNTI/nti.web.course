import React from 'react';
import PropTypes from 'prop-types';

import Card from '../parts/Card';

import Registry from './Registry';

@Registry.register('application/vnd.nextthought.courses.coursecataloglegacyentry')
export default class CatalogEntryType extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}


	render () {
		const {course, ...otherProps} = this.props;

		return (
			<Card course={course} {...otherProps} />
		);
	}
}
