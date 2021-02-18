import React from 'react';
import PropTypes from 'prop-types';
import {Errors} from '@nti/web-commons';

import Card from '../../card/View';

import GroupHeader from './GroupHeader';

const Section = styled('section')`
	margin-bottom: 2rem;

	&.mobile {
		padding: 0 0.625rem;
	}
`;

const List = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0 -8px;
	width: calc(100% + 16px);
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	&.mobile {
		margin: 0;
	}

	& > li {
		display: inline-block;
		margin: 7px 9px;
	}
`;

const getKey = item => item.getID() ?? item.CatalogEntryNTIID;

CourseCollectionGroup.propTypes = {
	group: PropTypes.shape({
		Items: PropTypes.array,
		error: PropTypes.any
	}),

	mobile: PropTypes.bool,

	getSectionTitle: PropTypes.func,
	onCourseDelete: PropTypes.func
};
export default function CourseCollectionGroup ({group, mobile, getSectionTitle, onCourseDelete}) {
	if (group.error) {
		return (
			<Errors.Message as="p" error={group.error} />
		);
	}

	if (!group?.Items || group.Items.length === 0 ) { return null; }

	return (
		<Section mobile={mobile}>
			<GroupHeader group={group} mobile={mobile} getSectionTitle={getSectionTitle} />
			<List mobile={mobile}>
				{group.Items.map((item) => (
					<li key={getKey(item)}>
						<Card course={item} onDelete={onCourseDelete} />
					</li>
				))}
			</List>
		</Section>
	);
}
