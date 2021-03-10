import React from 'react';
import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';

import Description from '../../common/Description';

export default class CourseEnrollmentBaseTypeDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getDescription: PropTypes.func.isRequired,
		}).isRequired,
	};

	render() {
		const { option } = this.props;

		return <Description {...rawContent(option.getDescription())} />;
	}
}
