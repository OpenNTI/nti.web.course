import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

import styles from './Mail.css';
import { default as Store, KEYS } from './Store';

const cx = classnames.bind(styles);
const t = scoped('course.roster.email', {
	buttonLabel: 'Email',
});

class Mail extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		filter: PropTypes.string,
		scopes: PropTypes.object,
	};

	render() {
		const {
			course,
			course: { canEmailEnrollees } = {},
			filter,
			scopes,
		} = this.props;

		const scopeNames = Object.keys(scopes || {});

		const context = {
			type: 'email',
			filter,
			scopes: ['All', ...(scopeNames.length > 1 ? scopeNames : [])],
		};

		return !canEmailEnrollees ? null : (
			<LinkTo.Object
				object={course}
				context={context}
				className={cx('email-button')}
			>
				{t('buttonLabel')}
			</LinkTo.Object>
		);
	}
}

export default decorate(Mail, [
	Store.monitor({
		[KEYS.COURSE]: 'course',
		[KEYS.FILTER]: 'filter',
		[KEYS.ENROLLMENT_SCOPES]: 'scopes',
	}),
]);
