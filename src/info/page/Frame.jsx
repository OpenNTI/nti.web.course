import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Page, Hooks, Loading } from '@nti/web-commons';
import { View } from '@nti/web-routing';

import NavBar from './components/NavBar';

const t = scoped('course.info.page.Frame', {
	title: 'Course Info',
});

const { useResolver } = Hooks;
const { isPending, isErrored, isResolved } = useResolver;

async function getCourseParts(course) {
	let access = null;
	let instance = null;
	let catalogEntry = null;

	if (course.isCourse && !course.isCourseCatalogEntry) {
		access = course.PreferredAccess;
		instance = course;
		catalogEntry = course.CatalogEntry;
	}

	return { access, instance, catalogEntry };
}

CourseInfoFrame.propTypes = {
	course: PropTypes.object,
	children: PropTypes.any,
};
export default function CourseInfoFrame({ course, children, ...otherProps }) {
	const resolver = useResolver(() => getCourseParts(course), [course]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const courseParts = isResolved(resolver) ? resolver : null;

	return (
		<View.WithTitle title={t('title')}>
			<Page>
				<Page.Navigation>
					<NavBar {...courseParts} />
				</Page.Navigation>
				<Page.Content card={false}>
					<Loading.Placeholder
						loading={loading}
						fallback={<Page.Content.Loading />}
					>
						{error && <Page.Content.Error error={error} />}
						{courseParts &&
							React.Children.map(children, child => {
								return React.cloneElement(child, {
									...courseParts,
									...otherProps,
								});
							})}
					</Loading.Placeholder>
				</Page.Content>
			</Page>
		</View.WithTitle>
	);
}
