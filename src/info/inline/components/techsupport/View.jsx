import React from 'react';
import { scoped } from 'nti-lib-locale';

import TechsupportLink from './TechsupportLink';

const TECHSUPPORT_LABELS = {
	support: 'Support',
	info: 'Info',
	website: 'NextThought Website',
	help: 'Help Site'
};

const t = scoped('components.course.editor.inline.components.techsupport.View', TECHSUPPORT_LABELS);

const TechSupport = () => (
	<div className="course-info-support">
		<h3 className="techsupport-header">Tech Support</h3>
		<div className="techsupport-info">
			<div className="techsupport-image" />
			<ul className="techsupport-links">
				<TechsupportLink href="mailto:support@nextthought.com" label={t('support')} />
				<TechsupportLink href="mailto:info@nextthought.com" label={t('info')} />
				<TechsupportLink href="http://nextthought.com" label={t('website')} />
				<TechsupportLink href="http://help.nextthought.com/" label={t('help')} />
			</ul>
		</div>
	</div>
);

export default TechSupport;