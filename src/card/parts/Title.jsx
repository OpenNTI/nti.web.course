import React from 'react';
import PropTypes from 'prop-types';
import {Text} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';

const Block = styled.div`
	overflow: hidden;
	margin-top: 4px;
`;

const Meta = styled.div`
	--gap: 5px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	margin: 0;
	margin-top: calc(-1 * var(--gap));
	margin-right: calc(-1 * var(--gap));

	& > * {
		flex: 0 1 auto;
		margin: 0;
		margin-top: var(--gap);
		margin-right: var(--gap);

		&:global(.course-date) {
			flex: 0 0 auto;
		}
	}
`;

const Token = styled(Text)`
	font: normal 700 0.625rem var(--body-font-family);
	text-transform: uppercase;
	color: var(--tertiary-grey);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: inline-block;
	line-height: 1.2rem;

	&.no-shrink {
		flex-shrink: 0;
	}

	@media (--respond-to-handhelds) {
		line-height: 1;
	}

	&.variant-list-item {
		line-height: 1.5;
	}
`;

const Title = styled(Text).attrs({as: 'h2'})`
	font: normal 700 1rem/1.3 var(--header-font-family);
	display: block;
	color: var(--primary-grey);
	text-transform: uppercase;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;

	@media (--respond-to-handhelds) {
		font-weight: 300;
		margin-bottom: 5px;
		white-space: normal;
	}

	&.variant-list-item {
		font-weight: 400;
		margin-bottom: 0.5rem;
		white-space: nowrap;
	}
`;


CourseCardTitle.propTypes = {
	course: PropTypes.shape({
		ProviderUniqueID: PropTypes.string,
		Title: PropTypes.string
	}),
	// hideSemester: PropTypes.bool
	variant: PropTypes.oneOf(['card', 'list-item']),
};

export default function CourseCardTitle ({course, variant}) {
	const dateText = getSemesterBadge(course);

	return (
		<Block className="nti-course-card-title" data-testid="nti-course-card-title-block">
			<Meta>
				<Token variant={variant} data-testid="provider-unique-id">{course.ProviderUniqueID}</Token>
				{dateText &&
					<Token variant={variant} no-shrink data-testid="course-date">{dateText}</Token>
				}
			</Meta>
			<Title variant={variant} limitLines={3} data-testid="course-title">{course.Title}</Title>
		</Block>
	);
}

