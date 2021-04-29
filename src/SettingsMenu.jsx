import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';

import DropCourse from './DropCourse';
import { DestructiveOption, Menu, Header, Option } from './SettingsMenuParts';

const ensureProtocol = x =>
	!x || /^(mailto|https?):/i.test(x) ? x : `mailto:${x}`;

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
	onBeforeDrop: PropTypes.func,
	onAfterDrop: PropTypes.func,
	registered: PropTypes.bool,
	supportContact: PropTypes.string,
};

export function SettingsMenu({
	course,
	onDelete,
	onDrop,
	onBeforeDrop: beforeDrop,
	onAfterDrop: afterDrop,
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
			<Option as="a" href={ensureProtocol(supportContact)}>
				{t('contactSupport')}
			</Option>
			<DestructiveOption onClick={onDelete} data-testid="delete-course">
				{t('delete')}
			</DestructiveOption>
			<DropCourse
				as={DestructiveOption}
				course={course}
				onDrop={onDrop}
				listeners={{ beforeDrop, afterDrop }}
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
