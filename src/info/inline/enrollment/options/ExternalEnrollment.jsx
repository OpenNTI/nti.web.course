import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import EnrollmentCard from '../common/EnrollmentCard';
import OptionText, {TITLE, DESCRIPTION} from '../common/OptionText';

export default class ExternalEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		className: PropTypes.string
	}

	state = {}

	render () {
		const {className, option} = this.props;

		const cls = cx('external', className);

		return (
			<EnrollmentCard
				title={OptionText.getContentFor(option, TITLE)}
				description={OptionText.getContentFor(option, DESCRIPTION)}
				className={cls}
				{...this.props}
			>
				<div className="url">{this.props.option.enrollmentURL}</div>
			</EnrollmentCard>
		);
	}
}
