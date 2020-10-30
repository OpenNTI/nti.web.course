import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Hooks as SessionHooks} from '@nti/web-session';
import {Page, Text, Hooks, Prompt, Iframe} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';

import PassFailMessage from '../../../progress/widgets/PassFailMessage';

import Styles from './Styles.css';

const {Navigation: {Outline}} = Page;

const t = scoped('course.overview.outline.header.StudentProgress', {
	label: 'Course Progress',
	completed: 'Completed',
	viewCertificate: 'View Certificate',
	itemsRemaining: {
		one: '%(count)s Item Remaining',
		other: '%(count)s Items Remaining'
	},
	certificateTitle: 'Certificate of Completion for %(title)s'
});

function useStudentProgress (course, active) {
	const wasActive = React.useRef(true);
	const forceUpdate = Hooks.useForceUpdate();

	React.useEffect(() => {
		if (!active) {
			wasActive.current = active;
			return;
		}

		const updateProgress = async () => {
			try {
				await course.refreshPreferredAccess();
				forceUpdate();
			} catch (e) {
				//swallow
			}
		};

		if (!wasActive.current) { updateProgress(); }

		return SessionHooks.afterBatchEvents.subscribe(updateProgress);
	}, [active]);

	return course.PreferredAccess.CourseProgress;
}

const getIsCompleted = progress => Boolean(progress?.getCompletedDate());
const getPercentComplete = progress => Math.floor((progress?.PercentageProgress ?? 0) * 100);
const getRemainingCount = progress => (progress?.MaxPossibleProgress ?? 0) - (progress?.AbsoluteProgress ?? 0);
const getRequirementsMet = progress => progress?.CompletedItem?.Success;

const getCertLink = course => course.PreferredAccess.getLink('Certificate');
const getTitle = course => course.PreferredAccess.CatalogEntry.title;

StudentProgress.handles = (course) => course.PreferredAccess?.isEnrollment && Object.keys(course).includes('CompletionPolicy');
StudentProgress.propTypes = {
	className: PropTypes.string,
	course: PropTypes.shape({
		PreferredAccess: PropTypes.object
	}),
	active: PropTypes.bool,
	noCertificateFrame: PropTypes.bool
};
export default function StudentProgress ({className, course, active, noCertificateFrame}) {
	const [showRemaining, setShowRemaining] = React.useState(false);
	const [showCert, setShowCert] = React.useState(false);

	const progress = useStudentProgress(course, active);
	const isCompleted = getIsCompleted(progress);
	const requirementsMet = isCompleted && getRequirementsMet(progress);
	const certLink = getCertLink(course);

	const linkProps = {
		role: 'button',
		className: Styles['progress-header']
	};

	if (isCompleted && certLink) {
		if (!noCertificateFrame) {
			linkProps.href = certLink;
			linkProps.target = '_blank';
		} else {
			linkProps.onClick = () => setShowCert(true);
		}
	} else if (!isCompleted) {
		linkProps.onClick = () => setShowRemaining(true);
	}

	let subLabel = '';

	if (isCompleted && requirementsMet) {
		subLabel = certLink ? t('viewCertificate') : t('completed');
	} else {
		subLabel = t('itemsRemaining', {count: getRemainingCount(progress)});
	}

	return (
		<Outline.Header as="a" {...linkProps} className={cx(Styles['student-progress-header'], className)}>
			<div>
				<div className={Styles['progress-header']}>
					<div className={Styles.percentage}>
						<CircularProgress
							width={38}
							height={38}
							value={getPercentComplete(progress)}
							showPctSymbol={false}
							deficitFillColor="#b8b8b8"
						/>
					</div>
					<Text.Base className={Styles.label}>{t('label')}</Text.Base>
					<Text.Base className={Styles['sub-label']}>{subLabel}</Text.Base>
				</div>
				{isCompleted && (
					<PassFailMessage course={course} requirementsMet={getRequirementsMet(requirementsMet)} />
				)}
				{showCert && (
					<Prompt.Dialog onBeforeDismiss={() => setShowCert(false)}>
						<Iframe
							downloadable
							src={certLink}
							title={t('certificateTitle', {title: getTitle(course)})}
						/>
					</Prompt.Dialog>
				)}
				{showRemaining && (
					<Prompt.Dialog onBeforeDismiss={() => setShowRemaining(false)}>
						<div>
							Remaining Items
						</div>
					</Prompt.Dialog>
				)}
			</div>
		</Outline.Header>
	);
}
