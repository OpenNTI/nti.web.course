import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Title from '../../common/Title';
import OptionList from '../../common/OptionList';

const t = scoped('course.enrollment.options.not-enrolled.View', {
	title: 'Start Learning',
});

export default class CourseEnrollmentOptionsNotEnrolled extends React.Component {
	static propTypes = {
		options: PropTypes.array,
	};

	state = {};

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { options: prevOptions } = prevProps;
		const { options: nextOptions } = this.props;

		if (nextOptions !== prevOptions) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { options } = this.props;
		const available = options.filter(option => option.isAvailable());

		this.setState({
			override: options.find(option => option.shouldOverride()),
			available: available,
			selected: available[0],
		});
	}

	selectOption = option => {
		this.setState({
			selected: option,
		});
	};

	render() {
		const { override } = this.state;

		return (
			<div className="nti-course-enrollment-options-not-enrolled">
				{override && this.renderOverride()}
				{!override && this.renderOptions()}
			</div>
		);
	}

	renderOptions() {
		const { available, selected } = this.state;

		if (!available) {
			return null;
		}

		const { Description, EnrollButton, SeatLimit } = selected || {};

		return (
			<React.Fragment>
				<Title>{t('title')}</Title>
				<OptionList
					options={available}
					selected={selected}
					selectOption={this.selectOption}
				/>
				{Description && <Description option={selected} />}
				{SeatLimit && <SeatLimit option={selected} />}
				{EnrollButton && <EnrollButton option={selected} />}
			</React.Fragment>
		);
	}

	renderOverride() {}
}
