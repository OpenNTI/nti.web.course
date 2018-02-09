import React from 'react';
import { scoped } from 'nti-lib-locale';

import TechsupportLink from './TechsupportLink';

const t = scoped('course.contactinfo', {
	label: 'Tech Support',
	link0: {
		label: 'Support',
		link: 'mailto:support@nextthought.com'
	},
	link1: {
		label: 'Info',
		link: 'mailto:info@nextthought.com'
	},
	link2: {
		label: 'NextThought Website',
		link: 'http://nextthought.com'
	},
	link3: {
		label: 'Help Site',
		link: 'https://help.nextthought.com/'
	}
});

const renderLink = index => {
	const label = t(`link${index}.label`);
	const link = t(`link${index}.link`);
	return (
		<TechsupportLink href={link} label={label} />
	);
};

const TechSupport = () => (
	<div className="course-info-support">
		<h3 className="techsupport-header">{t('label')}</h3>
		<div className="techsupport-info">
			<div className="techsupport-image" />
			<ul className="techsupport-links">
				{[0,1,2,3].map(x => renderLink(x))}
			</ul>
		</div>
	</div>
);


export default TechSupport;
