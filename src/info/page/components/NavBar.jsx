import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Page, HOC} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import {RouteNames} from '../Constants';

const {Navigation: {Outline}} = Page;
const {Variant} = HOC;

const t = scoped('course.info.page.components.NavBar', {
	title: 'Course Info',
	about: 'About'
});

const NameLink = Variant(Outline.Item, {as: LinkTo.Name, activeClassName: Outline.Item.activeClassName});

export default function CoursePageNavBar () {
	return (
		<Outline>
			<Outline.Header title={t('title')} />
			<NameLink name={RouteNames.About}>
				{t('about')}
			</NameLink>
		</Outline>
	);
}