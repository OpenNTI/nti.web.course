import React from 'react';

import { scoped } from '@nti/lib-locale';
import { Typography } from '@nti/web-core';

const t = scoped('nti-course.content.viewer.types.scorm.LaunchInfo', {
	scorm: {
		description: 'Launch %(name)s to get started!',
		disclaimer: 'Content may launch in a new window.',
	},
});

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

export function LaunchInfo({ item }) {
	return (
		<Container>
			<Typography type="body" as={Description} ph="lg" pv="xl">
				{t('scorm.description', { name: item.title })}
			</Typography>
			<Typography type="body" as={Disclaimer} ph="lg" pb="xxl">
				{t('scorm.disclaimer')}
			</Typography>
		</Container>
	);
}
