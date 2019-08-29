import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import PaddedContainer from '../../common/PaddedContainer';
import ActionItem from '../../common/ActionItem';

const t = scoped('course.enrollment.options.parts.enrolled.Current', {
	label: 'Enrolled',
	upgrade: 'Upgrade'
});

export default class CourseEnrollmentOptionsEnrolledCurrent extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			EnrolledTitle: PropTypes.func.isRequired,
			EnrolledDescription: PropTypes.func.isRequired,
			DropButton: PropTypes.func,
			OpenButton: PropTypes.func
		}),
		hasUpdates: PropTypes.bool,
		doUpgrade: PropTypes.func
	}


	onUpgrade = () => {
		const {doUpgrade} = this.props;

		if (doUpgrade) {
			doUpgrade();
		}
	}


	render () {
		const {option, hasUpdates} = this.props;
		const {
			EnrolledTitle,
			EnrolledDescription,
			DropButton,
			OpenButton
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
						<ActionItem className="upgrade" onClick={this.onUpgrade}>
							{t('upgrade')}
						</ActionItem>
					)}
				</div>
				{DropButton && (<DropButton option={option} />)}
				{OpenButton && (<OpenButton option={option} />)}
			</div>
		);
	}
}
