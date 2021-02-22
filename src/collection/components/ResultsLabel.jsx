import React from 'react';
import { PropTypes } from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Text, Theme } from '@nti/web-commons';

import Store from '../Store';

const t = scoped('course.collection.components.ResultsLabel', {
	results: 'Showing results for "%(searchTerm)s"',
});

const ResultsFor = styled(Text.Base).attrs({ as: 'div' })`
	font-size: 1.125rem;
	text-align: center;
	color: white;

	&.dark {
		color: var(--secondary-grey);
	}
`;

ResultsLabel.propTypes = {
	empty: PropTypes.bool,
};
export default function ResultsLabel({ empty }) {
	const { searchTerm } = Store.useValue();

	const background = Theme.useThemeProperty('background');
	const lightBackground = background === 'light';

	if (!searchTerm) {
		return null;
	}

	return (
		<ResultsFor dark={lightBackground}>
			{t('results', { searchTerm })}
		</ResultsFor>
	);
}
