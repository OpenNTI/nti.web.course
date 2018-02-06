import React from 'react';
import { scoped } from 'nti-lib-locale';

import TechsupportLink from './TechsupportLink';

const DEFAULT_TEXT = {
	label: 'Tech Support',
	LINK0: {
		label: 'Support',
		link: 'mailto:support@nextthought.com'
	},
	LINK1: {
		label: 'Info',
		link: 'mailto:info@nextthought.com'
	},
	LINK2: {
		label: 'NextThought Website',
		link: 'http://nextthought.com'
	},
	LINK3: {
		label: 'Help Site',
		link: 'https://help.nextthought.com/'
	}
};
const t = scoped('COURSE.CONTACTINFO', DEFAULT_TEXT);

const renderLink = index => {
	const label = t(`LINK${index}.label`);
	const link = t(`LINK${index}.link`);
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