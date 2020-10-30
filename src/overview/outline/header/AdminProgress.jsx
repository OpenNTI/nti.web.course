import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Page, Loading, Icons, Text} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';

import Styles from './Styles.css';

const {Navigation: {Outline}} = Page;

const t = scoped('course.overview.outline.header.AdminProgress', {
	label: 'Course Progress',
	studentsFinished: {
		one: '%(count)s Student Finished',
		other: '%(count)s Students Finished'
	}
});

const LOAD_WAIT = 5000;
const LoadingState = 'loading';

function useAdminProgress (course) {
	const lastLoad = React.useRef(null);
	const [progress, setProgress] = React.useState(LoadingState);

	React.useEffect(() => {
		let cancelled = false;

		const now = Date.now();
		const last = lastLoad.current;

		const shouldLoad = !last || (last.course !== course && (now - last.time) > LOAD_WAIT);


		if (!shouldLoad) { return; }

		const loadProgress = async () => {
			try {
				const courseProgress = await course.fetchLink('ProgressStats');

				if (cancelled) { return; }

				lastLoad.current = {
					time: now,
					course
				};

				setProgress(courseProgress);
			} catch (e) {
				if (cancelled) { return; }

				lastLoad.current = {
					time: now,
					course
				};

				setProgress(e);
			}
		};

		loadProgress();
		return () => cancelled = true;
	});

	return progress;
}

const getFinishedCount = progress => progress.CountCompleted;
const getFinishedPercentage = progress => Math.floor((progress?.PercentageProgress ?? 0) * 100);

AdminProgress.handles = (course) => course.PreferredAccess?.isAdministrative && Object.keys(course).includes('CompletionPolicy') && course.hasLink('ProgressStats');
AdminProgress.propTypes = {
	className: PropTypes.string,
	course: PropTypes.shape({
		fetchLink: PropTypes.func
	})
};
export default function AdminProgress ({className, course}) {
	const resolver = useAdminProgress(course);

	const loading = resolver === LoadingState;
	const error = resolver instanceof Error ? resolver : null;
	const progress = !loading && !error ? resolver : null;

	return (
		<Outline.Header className={cx(Styles['class-progress-header', className])}>
			<div className={Styles['progress-header']}>
				<div className={Styles.percentage}>
					{loading && (<Loading.Spinner blue />)}
					{error && (<Icons.Alert />)}
					{progress && (
						<CircularProgress
							width={38}
							height={38}
							value={getFinishedPercentage(progress)}
							showPctSymbol={false}
							deficitFillColor="#b8b8b8"
						/>
					)}
				</div>
				<Text.Base className={Styles.label}>{t('label')}</Text.Base>
				{progress && (
					<Text.Base className={Styles['sub-label']}>{t('studentsFinished', {count: getFinishedCount(progress)})}</Text.Base>
				)}
			</div>
		</Outline.Header>
	);
}
