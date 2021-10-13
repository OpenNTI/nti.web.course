import './Required.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.overview.lesson.items.required', {
	label: 'Required',
});

Required.propTypes = {
	className: PropTypes.string,
};
export default function Required({ className, ...prosp }) {
	return (
		<div
			{...prosp}
			className={cx('lesson-overview-item-required-label', className)}
		>
			{t('label')}
		</div>
	);
}
