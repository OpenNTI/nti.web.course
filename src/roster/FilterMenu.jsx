import React from 'react';
import PropTypes from 'prop-types';
import {Select} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import {default as Store, KEYS} from './Store';
import styles from './FilterMenu.css';

const cx = classnames.bind(styles);

const t = scoped('roster.component.filter-menu', {
	'no-filter': 'All Students',
	ForCredit: 'For Credit',
	ForCreditDegree: 'For Credit (degree)',
	ForCreditNonDegree: 'For Credit (non-degree)',
	Public: 'Open',
	Purchased: 'Purchased'
});


export default
@Store.monitor({
	[KEYS.OPTIONS]: 'options',
	[KEYS.BATCH_START]: 'batchStart',
	[KEYS.FILTER]: 'filter',
	[KEYS.ROSTER_SUMMARY]: 'summary'
})
class FilterMenu extends React.Component {

	static propTypes = {
		summary: PropTypes.object,
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
			summary: {
				TotalEnrollmentsByScope: scopes = {},
				TotalEnrollments: total = 0
			} = {}
		} = this.props;
		
		const options = Object.entries(scopes)
			.filter(([_, count]) => count) // filter out enrollment types with zero students
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
