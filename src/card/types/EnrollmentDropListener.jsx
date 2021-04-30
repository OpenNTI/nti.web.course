import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';
import { getService } from '@nti/web-client';

const Relative = styled('div')`
	position: relative;
`;

export function EnrollmentDropListener({ course, children }) {
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
