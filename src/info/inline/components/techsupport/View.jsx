import React from 'react';
import { scoped } from 'nti-lib-locale';

import TechsupportLink from './TechsupportLink';

const MISSING = '~~missing~~';
const nullIfMissing = v => v === MISSING ? null : v;

//This locale scope does not match its location yet because it was moved from the mobile app.
const t = scoped('course.contactInfo', {
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
	const label = nullIfMissing(t(`link${index}.label`, {fallback: MISSING}));
	const link = nullIfMissing(t(`link${index}.link`, {fallback: MISSING}));

	return label && (
		<TechsupportLink key={index} href={link} label={label} />
	);
};

const TechSupport = () => {
	const list = [0,1,2,3]
		.map(x => renderLink(x))
		.filter(Boolean);

	return list.length === 0 ? null : (
		<div className="course-info-support">
			<h3 className="techsupport-header">{t('label')}</h3>
			<div className="techsupport-info">
				<div className="techsupport-image" />
				<ul className="techsupport-links">
					{list}
				</ul>
			</div>
		</div>
	);
};


export default TechSupport;
