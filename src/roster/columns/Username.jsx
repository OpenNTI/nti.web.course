import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import Styles from './Username.css';

const cx = classnames.bind(Styles);
const t = scoped('roster.columns.username', {
	header: 'Username',
});

export default class Username extends React.Component {
	static SortKey = 'username';
	static Name = t('header');

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		const { item: { username } = {} } = this.props;

		return <div className={cx('username')}>{username}</div>;
	}
}
