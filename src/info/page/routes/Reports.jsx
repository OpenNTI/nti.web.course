import PropTypes from 'prop-types';

import { Widgets, List } from '@nti/web-reports';

const { Card } = Widgets;

CourseReports.propTypes = {
	instance: PropTypes.object,
};
export default function CourseReports({ instance }) {
	return (
		<Card>
			<List context={instance} />
		</Card>
	);
}
