import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { LinkTo } from '@nti/web-routing';
import { Avatar, DisplayName } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import styles from './Student.css';

const t = scoped('roster.columns.student', {
	header: 'Learner',
	email: 'Email',
});
const cx = classnames.bind(styles);

export default class Student extends React.Component {
	static SortKey = 'realname';
	static Name = t('header');
	static cssClassName = cx('student-cell');

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	onEmailClick = e => void e.stopPropagation();

	render() {
		const { item, item: { user } = {} } = this.props;
		const canEmail = (item || {}).hasLink && item.hasLink('Mail');
		const emailContext = !canEmail
			? void 0
			: {
					type: 'email',
			  };

		return (
			<div className={cx('student')}>
				<Avatar className={cx('avatar')} entity={user} />
				<DisplayName entity={user} />
				{canEmail && (
					<div
						className={cx('email-link-wrapper')}
						onClick={this.onEmailClick}
					>
						<LinkTo.Object object={item} context={emailContext}>
							{t('email')}
						</LinkTo.Object>
					</div>
				)}
			</div>
		);
	}
}
