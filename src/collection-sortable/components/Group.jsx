import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Errors, Loading } from '@nti/web-commons';
import { getService } from '@nti/web-client';

import Card from '../../card/View';

import { Grid } from './Grid';
import { GroupHeader } from './GroupHeader';

const Section = styled('section')`
	margin-bottom: 2rem;

	&.mobile {
		padding: 0 0.625rem;
	}
`;

const getKey = item => item.getID() ?? item.CatalogEntry?.getID();

const Relative = styled('div')`
	position: relative;
`;

const Crd = props => {
	const [loading, setLoading] = useState();
	const { course } = props;
	let unmounted;

	const isThisCourse = (c, cid) => {
		return cid === course.CatalogEntry?.CourseNTIID;
	};

	const onBeforeDrop = ({ course: c, courseId: cid }) => {
		if (!unmounted && isThisCourse(c, cid)) {
			setLoading(true);
		}
	};

	const onAfterDrop = ({ course: c, courseId: cid }) => {
		if (!unmounted && isThisCourse(c, cid)) {
			setLoading(false);
		}
	};

	useEffect(() => {
		const listen = async () => {
			const enrollment = await getService().then(s => s.getEnrollment());
			enrollment.addListener('beforedrop', onBeforeDrop);
			enrollment.addListener('afterdrop', onAfterDrop);
		};

		listen();

		return async () => {
			unmounted = true;
			const enrollment = await getService().then(s => s.getEnrollment());
			enrollment.removeListener('beforedrop', onBeforeDrop);
			enrollment.removeListener('afterdrop', onAfterDrop);
		};
	}, [course]);

	return (
		<Relative>
			<Card {...props} />
			<Loading.Overlay large label={null} loading={loading} />
		</Relative>
	);
};

CourseCollectionGroup.propTypes = {
	group: PropTypes.shape({
		Items: PropTypes.array,
		error: PropTypes.any,
	}),

	mobile: PropTypes.bool,

	getSectionTitle: PropTypes.func,
	onCourseDelete: PropTypes.func,
	onSortChange: PropTypes.func,
};
export function CourseCollectionGroup({
	group,
	mobile,
	getSectionTitle,
	onCourseDelete,
	onSortChange,
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
				onSortChange={onSortChange}
			/>
			<Grid as="ul">
				{columns =>
					group.Items.map(item => (
						<li key={getKey(item)}>
							<Crd
								course={item}
								onDelete={onCourseDelete}
								variant={columns === 1 ? 'list-item' : 'card'}
							/>
						</li>
					))
				}
			</Grid>
		</Section>
	);
}
