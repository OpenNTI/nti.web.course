
import { scoped } from '@nti/lib-locale';

import Description from '../../widgets/Description';

const t = scoped('course.info.inline.components.meettimes.Disclaimer', {
	description: 'When to be online together (local time).',
});

export default function MeetTimeDisclaimer() {
	return <Description>{t('description')}</Description>;
}
