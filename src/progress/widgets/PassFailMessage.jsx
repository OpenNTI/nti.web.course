import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import {RequirementDetails} from '../../pass-fail';

const t = scoped('course.progress.widgets.PassFailMessage', {
	successCongratulations: 'Congratulations!',
	successMessage: 'You successfully completed this course.',
	failMessage: 'You haven\'t met the requirements to complete this course yet.',
	failDetails: 'View Details'
});

export default class PassFailMessage extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		requirementsMet: PropTypes.bool
	}

	state = {}

	renderPassInfo () {
		return (
			<div className="success-message">
				<div className="congratulations">{t('successCongratulations')}</div>
				<div className="message">{t('successMessage')}</div>
			</div>
		);
	}

	renderFailInfo () {
		return (
			<div className="fail-message">
				<div className="message">{t('failMessage')}</div>
				<div className="details-link" onClick={this.viewDetails}>{t('failDetails')}</div>
			</div>
		);
	}

	viewDetails = () => {
		this.setState({
			viewDetails: true
		});
	}

	render () {
		const {requirementsMet, course} = this.props;
		const {viewDetails} = this.state;

		return (
			<div className={cx('pass-fail-message', { success: requirementsMet })}>
				{requirementsMet ? this.renderPassInfo() : this.renderFailInfo()}
				{viewDetails && (
					<RequirementDetails
						course={course}
						onBeforeDismiss={() => this.setState({viewDetails: false})}
					/>
				)}
			</div>
		);
	}
}
