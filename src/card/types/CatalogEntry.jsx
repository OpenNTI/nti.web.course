import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

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
			<LinkTo.Object object={course}>
				<Card course={course} {...otherProps} />
			</LinkTo.Object>
		);
	}
}
