import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Text, Theme } from '@nti/web-commons';

import { Grid } from './Grid';

//TODO: move the locale strings here from library/components/SectionTitle
const t = scoped('course.collection.GroupHeader', {
	upcoming: 'Upcoming Courses',
	current: 'Current Courses',
	archived: 'Archived Courses',
});

const getLocale = s => (t.isMissing(s) ? s : t(s));

const Header = styled('h1')`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	margin: 0;
`;

const Name = styled(Text.Base)`
	font-size: 1.125rem;
	font-weight: 300;
	line-height: 2;
	color: var(--secondary-grey);

	&.light {
		color: white;
	}
`;

const Sub = styled(Text.Base)`
	font-size: 1.125rem;
	font-weight: 300;
	line-height: 2;
	opacity: 0.3;
	color: var(--secondary-grey);
	margin-left: 0.5rem;

	&.light {
		color: white;
	}
`;

GroupHeader.propTypes = {
	group: PropTypes.shape({
		name: PropTypes.string,
		parent: PropTypes.string,
	}),
	getSectionTitle: PropTypes.func,
};
export function GroupHeader({ group, getSectionTitle = getLocale }) {
	const background = Theme.useThemeProperty('background');
	const lightBackground = background === 'light';

	const name = group.parent ?? group.name;
	const sub = group.parent ? group.name : null;

	if (name === 'self') {
		return null;
	}

	return (
		<Grid singleColumn>
			<Header>
				{name && (
					<Name light={!lightBackground}>
						{getSectionTitle(name)}
					</Name>
				)}
				{sub && (
					<Sub light={!lightBackground}>{getSectionTitle(sub)}</Sub>
				)}
			</Header>
		</Grid>
	);
}
