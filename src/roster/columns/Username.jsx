import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Sortable from './SortableHeader';

const t = scoped('roster.columns.username', {
	header: 'Username'
});

export default class Username extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired
	}

	static HeaderComponent = () => <Sortable>{t('header')}</Sortable>

	render () {
		const {item: {username} = {}} = this.props;

		return (
			<div>{username}</div>
		);
	}
}