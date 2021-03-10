import './Option.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button } from '@nti/web-commons';
import { rawContent } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.enrollment.admin.manage-enrollment.option', {
	enrollButton: 'Enroll User',
	dropButton: 'Remove User',
	dropConfirmation: {
		title: 'Are you sure?',
		description:
			'Removing the user will take away their access to the course material and remove all their course work.',
		cancel: 'Cancel',
		continue: 'Remove',
	},
	notAvailableWarning: {
		title: 'Are you sure?',
		description: 'This option is not available to students in the catalog.',
		cancel: 'Cancel',
		continue: 'Enroll',
	},
});

const DROP_CONFIRMATION = 'drop-confirmation';
const NOT_AVAILABLE_WARNING = 'not-available-warning';

const getDisclosureLocaleRoot = d => {
	if (d === DROP_CONFIRMATION) {
		return 'dropConfirmation';
	}
	if (d === NOT_AVAILABLE_WARNING) {
		return 'notAvailableWarning';
	}
};

const getDisclosureButtonCls = d => {
	if (d === DROP_CONFIRMATION) {
		return 'drop';
	}
	if (d === NOT_AVAILABLE_WARNING) {
		return 'not-available';
	}
};

export default class CourseEnrollmentAdminManageEnrollmentOption extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getTitle: PropTypes.func,
			getDescription: PropTypes.func,
			isAvailable: PropTypes.func,
			isEnrolled: PropTypes.func,
			getScope: PropTypes.func,
		}).isRequired,

		dropCourse: PropTypes.func,
		enrollInOption: PropTypes.func,
	};

	state = {};

	toggleEnrollment = () => {
		const { option } = this.props;

		if (option.isEnrolled()) {
			this.dropOption();
		} else {
			this.enrollOption();
		}
	};

	dropOption = () => {
		const { dropCourse } = this.props;
		const { disclosure } = this.state;

		if (disclosure !== DROP_CONFIRMATION) {
			this.setState({
				disclosure: DROP_CONFIRMATION,
			});
			return;
		}

		if (dropCourse) {
			dropCourse();
		}
	};

	enrollOption = () => {
		const { option, enrollInOption } = this.props;
		const { disclosure } = this.state;

		if (!option.isAvailable() && disclosure !== NOT_AVAILABLE_WARNING) {
			this.setState({
				disclosure: NOT_AVAILABLE_WARNING,
			});
			return;
		}

		if (enrollInOption) {
			enrollInOption(option);
		}
	};

	cancelAction = () => {
		this.setState({ disclosure: null });
	};

	render() {
		const { option } = this.props;
		const { disclosure } = this.state;
		const cls = cx('nti-course-enrollment-admin-manage-enrollment-option', {
			'not-available': !option.isAvailable(),
			enrolled: option.isEnrolled(),
			disclosure: !!disclosure,
		});

		return (
			<div className={cls}>
				<div className="info">
					<div className="meta">
						{this.renderTitle(option)}
						{this.renderDescription(option)}
					</div>
					{this.renderButton(option)}
				</div>
				{disclosure && this.renderDisclosure(disclosure)}
			</div>
		);
	}

	renderTitle(option) {
		const enrolled = option.isEnrolled();
		const title = enrolled ? option.getEnrolledTitle() : option.getTitle();

		return <div className="title" {...rawContent(title)} />;
	}

	renderDescription(option) {
		const enrolled = option.isEnrolled();
		const description = enrolled
			? option.getEnrolledDescription()
			: option.getDescription();

		return <div className="description" {...rawContent(description)} />;
	}

	renderButton(option) {
		const enrolled = option.isEnrolled();

		return (
			<Button
				className={cx({ enrolled })}
				rounded
				onClick={this.toggleEnrollment}
			>
				{enrolled ? t('dropButton') : t('enrollButton')}
			</Button>
		);
	}

	renderDisclosure(disclosure) {
		const localeRoot = getDisclosureLocaleRoot(disclosure);
		const buttonCls = getDisclosureButtonCls(disclosure);

		return (
			<div className={cx('disclosure', buttonCls)}>
				<i className="icon-alert" />
				<div className="message">
					<div className="title">{t(`${localeRoot}.title`)}</div>
					<div className="description">
						{t(`${localeRoot}.description`)}
					</div>
				</div>
				<div className="buttons">
					<Button
						className="cancel"
						rounded
						secondary
						onClick={this.cancelAction}
					>
						{t(`${localeRoot}.cancel`)}
					</Button>
					<Button
						className={buttonCls}
						rounded
						onClick={this.toggleEnrollment}
					>
						{t(`${localeRoot}.continue`)}
					</Button>
				</div>
			</div>
		);
	}
}
