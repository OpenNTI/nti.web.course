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

const hasRoster = course => course?.hasLink('CourseEnrollmentRoster');
const hasReports = course => course?.Reports?.length;
const hasCompletion = (course, catalogEntry) => catalogEntry?.hasLink('edit');
const hasLTI = course => course?.hasLink('lti-configured-tools');
const hasNavigation = course => course?.hasLink('UpdateCourseTabPreferences');

CoursePageNavBar.propTypes = {
	instance: PropTypes.object,
	catalogEntry: PropTypes.object
};
export default function CoursePageNavBar ({instance, catalogEntry}) {
	return (
		<Outline>
			<Outline.Header title={t('title')} />
			<NameLink name={RouteNames.About} exact>
				{t('about')}
			</NameLink>
			{hasRoster(instance) && (
				<NameLink name={RouteNames.Roster}>
					{t('roster')}
				</NameLink>
			)}
			{hasReports(instance) && (
				<NameLink name={RouteNames.Reports}>
					{t('reports')}
				</NameLink>
			)}
			{hasCompletion(instance, catalogEntry) && (
				<NameLink name={RouteNames.Completion}>
					{t('completion')}
				</NameLink>
			)}
			{hasLTI(instance) && (
				<NameLink name={RouteNames.LTI}>
					{t('lti')}
				</NameLink>
			)}
			{hasNavigation(instance) && (
				<NameLink name={RouteNames.Navigation}>
					{t('navigation')}
				</NameLink>
			)}
		</Outline>
	);
}