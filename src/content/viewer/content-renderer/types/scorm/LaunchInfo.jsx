
import { scoped } from '@nti/lib-locale';
import { Typography } from '@nti/web-core';

const t = scoped('nti-course.content.viewer.types.scorm.LaunchInfo', {
	scorm: {
		description: 'Launch %(name)s to get started!',
		disclaimer:
			'Content may launch in a new window. If you are having trouble viewing the content, try viewing it <a href="%(launch)s">here.</a>',
	},
});

const LocaleText = Typography.Translator(t);

const Container = styled.div`
	background: white;
`;

const Description = styled('p')`
	margin: 0;
	font-weight: 600;
`;

const Disclaimer = styled('p')`
	margin: 0;
`;

function getLaunchLink(item) {
	const link =
		item.ScormContentInfo && item.ScormContentInfo.getLink('LaunchSCORM');

	return link
		? `${link}?redirecturl=${encodeURIComponent(global.location.href)}`
		: null;
}

export function LaunchInfo({ item }) {
	return (
		<Container>
			<LocaleText
				localeKey="scorm.description"
				with={{ name: item.title }}
				type="body"
				as={Description}
				ph="lg"
				pv="xl"
			/>
			<LocaleText
				localeKey="scorm.disclaimer"
				with={{ launch: getLaunchLink(item) }}
				type="body"
				as={Disclaimer}
				ph="lg"
				pb="xxl"
			/>
		</Container>
	);
}
