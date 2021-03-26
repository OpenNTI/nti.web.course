import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';

import DropCourse from './DropCourse';
import { DestructiveOption, Menu, Header, Option } from './SettingsMenuParts';

const t = scoped('course.components.listing.CourseMenu', {
	edit: 'Edit Course Information',
	export: 'Export',
	delete: 'Delete Course',
	registered: "You're Registered",
	contactSupport: 'Contact Support',
});

SettingsMenu.propTypes = {
	course: PropTypes.object.isRequired,
	onEdit: PropTypes.func,
	onExport: PropTypes.func,
	onDelete: PropTypes.func,
	onDrop: PropTypes.func,
	registered: PropTypes.bool,
	supportContact: PropTypes.string,
};

export function SettingsMenu({
	course,
	onDelete,
	onDrop,
	onEdit,
	onExport,
	registered,
	supportContact,
}) {
	return (
		<Menu>
			<Header course={course} registered={registered} t={t} />
			<Option onClick={onEdit}>{t('edit')}</Option>
			<Option onClick={onExport}>{t('export')}</Option>
			<Option as="a" className="option" href={`mailto:${supportContact}`}>
				{t('contactSupport')}
			</Option>
			<DestructiveOption onClick={onDelete} data-testid="delete-course">
				{t('delete')}
			</DestructiveOption>
			<DropCourse
				as={DestructiveOption}
				course={course}
				onDrop={onDrop}
				icon={false}
				data-testid="drop-course"
			/>
		</Menu>
	);
}

export default props => {
	const [supportContact, setSupportContact] = useState();
	useEffect(() => {
		(async () => {
			setSupportContact(
				(await getService()).getSupportLinks().supportContact
			);
		})();
	}, []);

	return <SettingsMenu {...props} supportContact={supportContact} />;
};
