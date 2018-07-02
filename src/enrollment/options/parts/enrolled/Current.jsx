import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import PaddedContainer from '../../common/PaddedContainer';

const t = scoped('course.enrollment.options.parts.enrolled.Current', {
	label: 'Enrolled',
	upgrade: 'Upgrade'
});

export default class CourseEnrollmentOptionsEnrolledCurrent extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			EnrolledTitle: PropTypes.func.isRequired,
			EnrolledDescription: PropTypes.func.isRequired,
			DropButton: PropTypes.func
		}),
		hasUpdates: PropTypes.bool,
		doUpdate: PropTypes.func
	}


	onUpgrade = () => {
		const {doUpdate} = this.props;

		if (doUpdate) {
			doUpdate();
		}
	}


	render () {
		const {option, hasUpdates} = this.props;
		const {
			EnrolledTitle,
			EnrolledDescription,
			Actions,
			DropButton
		} = option;

		return (
			<div className="nti-course-enrollment-options-enrolled-current">
				<PaddedContainer className="title">
					<i className="icon-check" />
					<span>{t('label')}</span>
				</PaddedContainer>
				<div className="contents">
					<EnrolledTitle option={option} />
					<EnrolledDescription option={option} />
					{hasUpdates && (
						<PaddedContainer className="upgrade" onClick={this.onUpgrade}>
							{t('upgrade')}
						</PaddedContainer>
					)}
				</div>
				{DropButton && (<DropButton option={option} />)}
			</div>
		);
	}
}
