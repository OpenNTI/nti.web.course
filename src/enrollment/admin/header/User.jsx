import './User.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { User } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.enrollment.admin.header.User', {
	notSelected: 'Select a User...',
});

export default class CourseEnrollmentAdminHeaderUserItem extends React.Component {
	static propTypes = {
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		locked: PropTypes.bool,
		onSelected: PropTypes.func,
	};

	onClear = () => {
		const { onSelected } = this.props;

		if (onSelected) {
			onSelected(null);
		}
	};

	render() {
		const { user } = this.props;

		return (
			<div className="course-enrollment-admin-header-user-item">
				{user && this.renderUser(user)}
				{!user && this.renderEmpty()}
			</div>
		);
	}

	renderEmpty() {
		return <div className="empty">{t('notSelected')}</div>;
	}

	renderUser(user) {
		const { locked } = this.props;

		return (
			<div className="user">
				<User.Avatar user={user} />
				<User.DisplayName user={user} />
				{!locked && (
					<div className="clear" onClick={this.onClear}>
						<i className="icon-bold-x" />
					</div>
				)}
			</div>
		);
	}
}
