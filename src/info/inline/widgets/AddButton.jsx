import './AddButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.widgets.AddButton', {
	defaultLabel: 'Add',
});

AddButton.propTypes = {
	clickHandler: PropTypes.func.isRequired,
	label: PropTypes.string,
	className: PropTypes.string,
};

export default function AddButton({ clickHandler, label, className }) {
	const cls = cx('add-button', className);

	return (
		<div className={cls} onClick={clickHandler}>
			<div className="add-icon">
				<i className="icon-add" />
			</div>
			<div className="add-label">{label || t('defaultLabel')}</div>
		</div>
	);
}
