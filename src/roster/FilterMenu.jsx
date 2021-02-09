import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {Select} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import {DEFAULT_ENROLLMENT_SCOPE_NAMES} from '../enrollment/Constants';

import {default as Store, KEYS} from './Store';
import styles from './FilterMenu.css';

const cx = classnames.bind(styles);

const t = scoped('roster.component.filter-menu', {
	'no-filter': 'All Learners',
	...DEFAULT_ENROLLMENT_SCOPE_NAMES
});

class FilterMenu extends React.Component {

	static propTypes = {
		scopes: PropTypes.object,
		store: PropTypes.object.isRequired,
		options: PropTypes.object,
	}

	onChange = ({target: {value: filter}}) => {
		const {store} = this.props;
		store.addOptions({
			[KEYS.BATCH_START]: 0,
			[KEYS.FILTER]: filter
		});
	}

	render () {
		const {
			className,
			options: {filter} = {},
			scopes
		} = this.props;

		const total = Object.values(scopes || {}).reduce((a, v) => a + v, 0);

		const options = Object.entries(scopes || {})
			.map(([scope, count]) => (
				<option key={scope} value={scope}>
					{t(scope, {fallback: scope})} ({count})
				</option>
			));

		return (options || []).length < 2 ? null : ( // omit menu if there's only one scope (or zero scopes)
			<div className={cx('filter-menu', className)}>
				<Select onChange={this.onChange} value={filter || ''}>
					<option value="">{t('no-filter')} ({total})</option>
					{options}
				</Select>
			</div>
		);
	}
}


export default decorate(FilterMenu, [
	Store.monitor({
		[KEYS.OPTIONS]: 'options',
		[KEYS.BATCH_START]: 'batchStart',
		[KEYS.FILTER]: 'filter',
		[KEYS.ENROLLMENT_SCOPES]: 'scopes'
	})
]);
