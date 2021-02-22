import React from 'react';
import { scoped } from '@nti/lib-locale';
import { EmptyState, Theme } from '@nti/web-commons';

import Store from '../Store';

const t = scoped('course.collection.components.Empty', {
	noSearch: {
		AdministeredCourses: 'No Administered Courses',
	},
	search: {
		AdministeredCourses: 'No Matching Administered Courses',
	},
});

const Empty = styled(EmptyState)`
	color: white;
	opacity: 0.5;

	&.dark {
		color: var(--secondary-grey);
		opacity: 1;
	}
`;

export default function EmptyCourseCollection() {
	const { collection, searchTerm } = Store.useValue();

	const background = Theme.useThemeProperty('background');
	const lightBackground = background === 'light';

	const key = `${searchTerm ? 'search' : 'noSearch'}.${collection.Title}`;

	if (t.isMissing(key)) {
		return null;
	}

	return <Empty header={t(key)} dark={lightBackground} />;
}
