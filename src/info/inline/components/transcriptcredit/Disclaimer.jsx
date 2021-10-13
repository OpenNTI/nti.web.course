
import { scoped } from '@nti/lib-locale';

import Description from '../../widgets/Description';

const t = scoped('course.info.inline.components.transcriptcredit.Disclaimer', {
	description:
		'Award credit when this course is successfully completed. Credits appear on reports and transcripts.',
});

export default function TranscriptCreditDisclaimer() {
	return <Description>{t('description')}</Description>;
}
