import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Checkbox, Icons} from '@nti/web-commons';

import Styles from './Modal.css';
import Items from './items';

const t = scoped('course.progress.remaining-items.Modal', {
	requiredOnly: 'Only Required Items',
	incompleteOnly: 'Only Incomplete Items'
});

RemainingItemsModal.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func
};
export default function RemainingItemsModal ({className, onClose, ...otherProps}) {
	const [requiredOnly, setRequiredOnly] = React.useState(true);
	const [incompleteOnly, setIncompleteOnly] = React.useState(true);

	return (
		<div className={cx(className, Styles['remaining-items-modal'])}>
			<div className={Styles.header}>
				<Checkbox checked={requiredOnly} label={t('requiredOnly')} onChange={e => setRequiredOnly(e.target.checked)} />
				<Checkbox checked={incompleteOnly} label={t('incompleteOnly')} onChange={e => setIncompleteOnly(e.target.checked)} />
				<div className={Styles.spacer} />
				<Icons.X  className={Styles.close} onClick={onClose} />
			</div>
			<Items requiredOnly={requiredOnly} incompleteOnly={incompleteOnly} {...otherProps} />
		</div>
	);
}

