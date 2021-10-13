import PropTypes from 'prop-types';

import { findActiveType } from './types';
import OverviewContainer from './components/OverviewContainer';

CourseAccess.hasData = (catalogEntry, { enrollmentAccess }) =>
	enrollmentAccess?.isAdministrative;
CourseAccess.propTypes = {
	catalogEntry: PropTypes.object,
};
export default function CourseAccess({ catalogEntry }) {
	const activeType = findActiveType(catalogEntry);
	const Display = activeType?.Display;

	return (
		<OverviewContainer>
			{Display && <Display catalogEntry={catalogEntry} />}
		</OverviewContainer>
	);
}
