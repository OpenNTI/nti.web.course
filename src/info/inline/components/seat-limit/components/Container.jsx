import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Description from '../../../widgets/Description';

const t = scoped(
	'course.info.inline.components.seat-limit.components.Container',
	{
		label: 'Seat Limit',
		description: 'Set a max number of seats available for this course.',
	}
);

export default function CourseSeatLimitContainer({ children }) {
	return (
		<div className={cx('columned', 'seat-limit')}>
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
				<Description>{t('description')}</Description>
			</div>
			<div className="content-column">{children}</div>
		</div>
	);
}
