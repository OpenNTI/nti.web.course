import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

import OptionList from '../../common/OptionList';
import Title from '../../common/Title';
import Button from '../../common/Button';

const t = scoped('course.enrollment.options.parts.enrolled.Upgrade', {
	title: 'Upgrade your Learning',
	cancel: 'Cancel',
	upgrade: 'Upgrade'
});


export default class CourseEnrollmentOptionsEnrolledUpgrade extends React.Component {
	static propTypes = {
		options: PropTypes.array,
		onCancel: PropTypes.func
	}

	state = {selected: null}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {options:oldOptions} = prevProps;
		const {options:newOptions} = this.props;

		if (oldOptions !== newOptions) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {options} = props;

		this.setState({
			selected: options.find(option => option.isEnrolled)
		});
	}


	selectOption = (option) => {
		this.setState({
			selected: option
		});
	}


	render () {
		const {options} = this.props;
		const {selected} = this.state;

		return (
			<div className="nti-course-enrollment-enrolled-upgrade">
				<Title>{t('title')}</Title>
				<OptionList options={options} selected={selected} selectOption={this.selectOption} />
				{this.renderSelectedOption(selected)}
				{this.renderActions(selected)}
			</div>
		);
	}


	renderSelectedOption (selected) {
		const {UpgradeDescription} = selected || {};

		return UpgradeDescription ? <UpgradeDescription option={selected} /> : null;
	}


	renderActions (selected) {
		return (
			<div className="actions">
				<Button className="cancel" onClick={this.onCancel}>
					{t('cancel')}
				</Button>
				{(!selected || selected.isEnrolled()) && (
					<Button className="disabled upgrade">
						{t('upgrade')}
					</Button>
				)}
				{(selected && !selected.isEnrolled()) && (
					<LinkTo.Object object={selected} context="enroll" className="upgrade">
						<Button>
							{t('upgrade')}
						</Button>
					</LinkTo.Object>
				)}
			</div>
		);
	}
}
