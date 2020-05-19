import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Page, HOC} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import {RouteNames} from '../Constants';

const {Navigation: {Outline}} = Page;
const {Variant} = HOC;

const t = scoped('course.info.page.components.NavBar', {
	title: 'Course Info',
	about: 'About',
	reports: 'Reports',
	roster: 'Roster',
	completion: 'Completion',
	lti: 'LTI Tools'
});

const NameLink = Variant(Outline.Item, {as: LinkTo.Name, activeClassName: Outline.Item.activeClassName});

export default function CoursePageNavBar () {
	return (
		<Outline>
			<Outline.Header title={t('title')} />
			<NameLink name={RouteNames.About} exact>
				{t('about')}
			</NameLink>
			<NameLink name={RouteNames.Roster}>
				{t('roster')}
			</NameLink>
			<NameLink name={RouteNames.Reports}>
				{t('reports')}
			</NameLink>
			<NameLink name={RouteNames.Completion}>
				{t('completion')}
			</NameLink>
			<NameLink name={RouteNames.LTI}>
				{t('lti')}
			</NameLink>
		</Outline>
	);
}