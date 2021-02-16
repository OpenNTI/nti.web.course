import React from 'react';
import PropTypes from 'prop-types';

import EnrollButton from '../base/EnrollButton';

export default class CourseEnrollmentOptionsFiveMinuteEnrollButton extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			isPending: PropTypes.func,
			isRejected: PropTypes.func,
			isApiDown: PropTypes.func,
		}).isRequired,
	};

	render() {
		const { option } = this.props;

		if (option.isPending() || option.isRejected() || option.isApiDown()) {
			return null;
		}

		return <EnrollButton {...this.props} />;
	}
}
