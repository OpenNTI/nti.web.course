import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('roster.columns.username', {
	header: 'Username'
});

export default class Username extends React.Component {

	static SortKey = 'username'
	static Name = t('header')

	static propTypes = {
		item: PropTypes.object.isRequired
	}

	render () {
		const {item: {username} = {}} = this.props;

		return (
			<div>{username}</div>
		);
	}
}