import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';

const translation = scoped('course.progress.completion.Notification', {
	dismiss: 'Dismiss',
	viewCertificate: 'View Certificate',
	congratulations: 'Congratulations!',
	description:
		'You successfully completed this course.\nYou will find course credit reflected on your transcript.',
});

export const Translate = Text.Translator(translation);
