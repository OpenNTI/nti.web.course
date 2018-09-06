import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import Title from '../../common/Title';
import Description from '../../common/Description';
import PaddedContainer from '../../common/PaddedContainer';
import OptionDescription from '../base/Description';

export default class CourseEnrollmentOptionsFiveMinuteDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			admissionState: PropTypes.string,
			seatCount: PropTypes.number,
			apiDown: PropTypes.bool
		}).isRequired
	}


	render () {
		const {option} = this.props;

		let content = null;

		if (option.isPending()) {
			content = this.renderPending();
		} else if (option.isRejected()) {
			content = this.renderRejected();
		} else if (option.isApiDown()) {
			content = this.renderApiDown();
		} else {
			content = this.renderAvailable();
		}


		return (
			<div className="nti-course-enrollment-five-minute-description">
				{content}
			</div>
		);
	}


	renderPending () {
		const {option} = this.props;

		return (
			<React.Fragment>
				<PaddedContainer className="label" {...rawContent(option.getPendingLabel())} />
				<Description {...rawContent(option.getPendingDescription())} />
			</React.Fragment>
		);
	}


	renderRejected () {
		const {option} = this.props;

		return (
			<React.Fragment>
				<Title className="title" {...rawContent(option.getRejectedTitle())} />
				<Description {...rawContent(option.getRejectedDescription())} />
			</React.Fragment>
		);
	}


	renderApiDown () {
		const {option} = this.props;

		return (
			<React.Fragment>
				<Description {...rawContent(option.getApiDownDescription())} />
			</React.Fragment>
		);
	}


	renderAvailable () {
		const {option} = this.props;

		return (
			<React.Fragment>
				{option.getAvailableSeats() <= 10 && (
					<PaddedContainer className="seats-available label" {...rawContent(option.getAvailabelSeatsLabel())} />
				)}
				<OptionDescription {...this.props} />
			</React.Fragment>
		);
	}
}
