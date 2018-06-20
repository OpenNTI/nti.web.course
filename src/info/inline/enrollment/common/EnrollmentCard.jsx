import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, DialogButtons} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

const t = scoped('course.info.inline.enrollment.common.EnrollmentCard', {
	areYouSure: 'Do you want to remove this enrollment option from the course?',
	cancel: 'Cancel',
	save: 'Save',
	ok: 'OK'
});

export default class EnrollmentCard extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		postTitleCmp: PropTypes.object,
		children: PropTypes.array
	}

	state = {}

	render () {
		const {title, description} = this.props;

		const cls = cx('enrollment-card');

		return (
			<div className={cls}>
				<div className="enrollment-header"><div className="title">{title}</div>{this.props.postTitleCmp}</div>
				<div className="description">{description}</div>
				{this.props.children}
			</div>
		);
	}
}
