import PropTypes from 'prop-types';

import CourseInfo from '../../inline/CourseInfo';

CourseAbout.propTypes = {
	instance: PropTypes.object,
	catalogEntry: PropTypes.shape({
		hasLink: PropTypes.func,
	}),
};
export default function CourseAbout({ instance, catalogEntry }) {
	return (
		<CourseInfo
			catalogEntry={catalogEntry}
			bundle={instance}
			editable={catalogEntry.hasLink('edit')}
			hasAdminToolsAccess={false}
			showRoster={false}
			showReports={false}
			showAdvanced={false}
		/>
	);
}
