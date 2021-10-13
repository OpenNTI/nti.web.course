import { useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Text } from '@nti/web-commons';

import Styles from './Style.css';

const Group = 'remaining-items-tab';

RemainingItemsTab.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,

	selected: PropTypes.bool,
	onSelect: PropTypes.func,
};
export default function RemainingItemsTab({ label, name, selected, onSelect }) {
	const onChange = useCallback(
		e => {
			if (!selected && e.target.checked) {
				onSelect?.(name);
			}
		},
		[selected, onSelect]
	);

	return (
		<label className={cx(Styles.tab, { [Styles.selected]: selected })}>
			<input
				type="radio"
				name={Group}
				checked={selected}
				onChange={onChange}
			/>
			<Text.Base>{label}</Text.Base>
		</label>
	);
}
