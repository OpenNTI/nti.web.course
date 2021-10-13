import PropTypes from 'prop-types';

import { Hooks, Text } from '@nti/web-commons';

const Authors = styled(Text.Base).attrs({ as: 'div' })`
	font: normal 700 0.625rem/1.4 var(--body-font-family);
	color: var(--primary-blue);
	text-transform: uppercase;

	&.variant-mobile {
		font-weight: 400;
		margin-top: 5px;
	}
`;

CourseCardAuthors.propTypes = {
	course: PropTypes.shape({
		getAuthorLine: PropTypes.func.isRequired,
	}).isRequired,
};
export default function CourseCardAuthors({ course }) {
	const { matches } = Hooks.useMediaQuery('handhelds');
	const variant = matches ? 'mobile' : 'default';

	return (
		<Authors
			className="nti-course-card-authors"
			data-testid="course-authors"
			limitLines={matches ? 1 : 2}
			variant={variant}
		>
			{course.getAuthorLine()}
		</Authors>
	);
}
