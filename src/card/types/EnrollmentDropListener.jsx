import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Loading, useService } from '@nti/web-commons';

const Relative = styled('div')`
	position: relative;
`;

export function EnrollmentDropListener({ course, children }) {
	const service = useService();
	const [loading, setLoading] = useState();
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
		const enrollment = service.getEnrollment();
		enrollment.addListener('beforedrop', onBeforeDrop);
		enrollment.addListener('afterdrop', onAfterDrop);

		return () => {
			unmounted = true;
			enrollment.removeListener('beforedrop', onBeforeDrop);
			enrollment.removeListener('afterdrop', onAfterDrop);
		};
	}, [course]);

	return (
		<Relative>
			{children}
			<Loading.Overlay large label={null} loading={loading} />
		</Relative>
	);
}

EnrollmentDropListener.propTypes = {
	course: PropTypes.shape({
		CatalogEntry: PropTypes.shape({
			CourseNTIID: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};
