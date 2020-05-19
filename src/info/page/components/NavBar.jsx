import React from 'react';
import PropTypes from 'prop-types';
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
	lti: 'LTI Tools',
	navigation: 'Navigation'
});

const NameLink = Variant(Outline.Item, {as: LinkTo.Name, activeClassName: Outline.Item.activeClassName});

const hasLTI = course => course?.hasLink('lti-configured-tools');
const hasTabs = course => course?.hasLink('UpdateCourseTabPreferences');

CoursePageNavBar.propTypes = {
	instance: PropTypes.object
};
export default function CoursePageNavBar ({instance}) {
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
			{hasLTI(instance) && (
				<NameLink name={RouteNames.LTI}>
					{t('lti')}
				</NameLink>
			)}
			{hasTabs(instance) && (
				<NameLink name={RouteNames.Navigation}>
					{t('navigation')}
				</NameLink>
			)}
		</Outline>
	);
}