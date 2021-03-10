import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.roster.invite', {
	message: {
		one: 'The following email is invalid:',
		other: 'The following emails are invalid:',
	},
	'message-more': '…and %(count)s more.',
});

import styles from './InvalidEmails.css';

const cx = classnames.bind(styles);

const count = (acc, item) => {
	acc[item] = (acc[item] || 0) + 1;
	return acc;
};

const limit = 5;

export default class InvalidEmails extends React.PureComponent {
	static propTypes = {
		invalid: PropTypes.array,
	};

	render() {
		const { invalid } = this.props;

		if (!invalid || invalid.length === 0) {
			return null;
		}

		const items = invalid.reduce(count, {});
		const entries = Object.entries(items);
		const show = entries.slice(0, limit);
		const remaining = Math.max(0, entries.length - limit);

		return (
			<div className={cx('invalid-emails')}>
				<div className={cx('message')}>
					{t('message', { count: show.length })}
				</div>
				<ul>
					{show.map(([email, occurrences]) => (
						<li key={email}>
							<span className={cx('email')}>{email}</span>
							{occurrences > 1 && (
								<span className={cx('count')}>
									({occurrences})
								</span>
							)}
						</li>
					))}
				</ul>
				{remaining > 0 && (
					<div className={cx('message-more')}>
						{t('message-more', { count: remaining })}
					</div>
				)}
			</div>
		);
	}
}
