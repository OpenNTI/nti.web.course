import React from 'react';
import PropTypes from 'prop-types';

import { Errors } from '@nti/web-commons';

import Card from '../../card/View';

import Grid from './Grid';
import GroupHeader from './GroupHeader';

const Section = styled('section')`
	margin-bottom: 2rem;

	&.mobile {
		padding: 0 0.625rem;
	}
`;

const getKey = item => item.getID() ?? item.CatalogEntry?.getID();

CourseCollectionGroup.propTypes = {
	group: PropTypes.shape({
		Items: PropTypes.array,
		error: PropTypes.any,
	}),

	mobile: PropTypes.bool,

	getSectionTitle: PropTypes.func,
	onCourseDelete: PropTypes.func,
};
export default function CourseCollectionGroup({
	group,
	mobile,
	getSectionTitle,
	onCourseDelete,
}) {
	if (group.error) {
		return <Errors.Message as="p" error={group.error} />;
	}

	if (!group?.Items || group.Items.length === 0) {
		return null;
	}

	return (
		<Section mobile={mobile}>
			<GroupHeader
				group={group}
				mobile={mobile}
				getSectionTitle={getSectionTitle}
			/>
			<Grid as="ul">
				{(columns) => (
					group.Items.map(item => (
						<li key={getKey(item)}>
							<Card course={item} onDelete={onCourseDelete} variant={columns === 1 ? 'list-item' : 'card'} />
						</li>
					))
				)}
			</Grid>
		</Section>
	);
}
