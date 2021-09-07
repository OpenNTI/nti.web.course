import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';
import { Credly } from '@nti/web-integrations';

const t = scoped('nti-course.admin-tools.advanced.completion.Badges', {
	label: 'Completion Badges',
});

Badges.propTypes = {
	course: PropTypes.object,
	disabled: PropTypes.bool,
};
export default function Badges({ course, disabled }) {
	return (
		<Credly.IfConnected context={course} canConnect>
			<div className={cx('badge-control', { disabled })}>
				<Text.Base as="div" className="label">
					{t('label')}
				</Text.Base>
				{!disabled && <Credly.Badges.AwardsBadges context={course} />}
			</div>
		</Credly.IfConnected>
	);
}
