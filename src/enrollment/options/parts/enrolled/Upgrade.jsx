import './Upgrade.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import OptionList from '../../common/OptionList';
import Title from '../../common/Title';
import Button from '../../common/Button';
import EnrollmentLink from '../../common/EnrollmentLink';

const t = scoped('course.enrollment.options.parts.enrolled.Upgrade', {
	title: 'Upgrade your Learning',
	cancel: 'Cancel',
	upgrade: 'Upgrade',
});

export default class CourseEnrollmentOptionsEnrolledUpgrade extends React.Component {
	static propTypes = {
		options: PropTypes.array,
		onCancel: PropTypes.func,
	};

	state = { selected: null };

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { options: oldOptions } = prevProps;
		const { options: newOptions } = this.props;

		if (oldOptions !== newOptions) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { options } = props;

		this.setState({
			selected: options.find(option => option.isEnrolled),
		});
	}

	selectOption = option => {
		this.setState({
			selected: option,
		});
	};

	onCancel = () => {
		const { onCancel } = this.props;

		if (onCancel) {
			onCancel();
		}
	};

	render() {
		const { options } = this.props;
		const { selected } = this.state;

		return (
			<div className="nti-course-enrollment-enrolled-upgrade">
				<Title>{t('title')}</Title>
				<OptionList
					options={options}
					selected={selected}
					selectOption={this.selectOption}
				/>
				{this.renderSelectedOption(selected)}
				{this.renderActions(selected)}
			</div>
		);
	}

	renderSelectedOption(selected) {
		const { Description } = selected || {};

		return Description ? <Description option={selected} /> : null;
	}

	renderActions(selected) {
		return (
			<div className="actions">
				<Button className="cancel" onClick={this.onCancel}>
					{t('cancel')}
				</Button>
				{(!selected || selected.isEnrolled()) && (
					<Button className="disabled upgrade">{t('upgrade')}</Button>
				)}
				{selected && !selected.isEnrolled() && (
					<EnrollmentLink option={selected} className="upgrade">
						<Button>{t('upgrade')}</Button>
					</EnrollmentLink>
				)}
			</div>
		);
	}
}
