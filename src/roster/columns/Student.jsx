import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, DisplayName} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import styles from './Student.css';
import Sortable from './SortableHeader';

const t = scoped('roster.columns.student', {
	header: 'Student'
});
const cx = classnames.bind(styles);

export default class Student extends React.Component {

	static HeaderComponent = ({setSort, sortedOn, sortedOrder} = {}) => (
		<Sortable {...{setSort, sortedOn, sortedOrder}} sortOn="realname">{t('header')}</Sortable>
	)

	static cssClassName = cx('student-cell')

	static propTypes = {
		item: PropTypes.object.isRequired
	}

	render () {
		const {item: {user} = {}} = this.props;

		return (
			<div className={cx('student')}>
				<Avatar className={cx('avatar')} entity={user} />
				<DisplayName entity={user} />
			</div>
		);
	}
}
