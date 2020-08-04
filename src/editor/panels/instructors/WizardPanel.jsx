import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Loading, Errors} from '@nti/web-commons';
import {getAppUser} from '@nti/web-client';

import {Edit as EditFacilitators} from '../../../info/inline/components/facilitators';

import Styles from './WizardPanel.css';

const cx = classnames.bind(Styles);
const t = scoped('course.editor.panels.instructors.WizardPanel', {
	cancel: 'Continue to Course',
	save: 'Save Facilitators'
});

const {Utils} = EditFacilitators;

function getCourseInstance (catalogEntry) {
	return catalogEntry.parent()?.CourseInstance;
}

InstructorsWizardPanel.hideBackButton = true;
InstructorsWizardPanel.propTypes = {
	afterSave: PropTypes.func,
	catalogEntry: PropTypes.any,
	saveCmp: PropTypes.func
};
export default function InstructorsWizardPanel ({catalogEntry, afterSave, saveCmp}) {
	const courseInstance = getCourseInstance(catalogEntry);
	const [facilitators, setFacilitators] = React.useState(null);
	const [error, setError] = React.useState(null);

	const SaveCmp = saveCmp;

	React.useEffect(() => {
		let unmounted = false;

		const loadUser = async () => {
			try {
				const user = await getAppUser();
				const {alias: Name, Username: username} = user;

				if (unmounted) { return; }

				setFacilitators([{
					username,
					role: Utils.ROLES.INSTRUCTOR,
					Name,
					JobTitle: Utils.roleDisplayName(Utils.ROLES.INSTRUCTOR),
					visible: false,
					MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
					Class: 'CourseCatalogInstructorLegacyInfo'
				}]);
			} catch (e) {
				//swallow
				setFacilitators([]);
			}
		};

		loadUser();
		return () => unmounted = true;
	}, []);

	const onValueChange = (name, updated) => (setFacilitators(updated), setError(null));

	const onCancel = () => {
		afterSave?.();
	};

	const saveFacilitators = async () => {
		try {
			await Utils.saveFacilitators(catalogEntry, courseInstance, facilitators);
		
			afterSave?.();
		} catch (e) {
			setError(e);
		}
	};

	return (
		<div>
			<div className={cx('instructors-wizard-panel')}>
				{error && (<Errors.Message error={error} />)}
				<Loading.Placeholder loading={!facilitators} fallback={(<Loading.Spinner.Large />)}>
					{facilitators && (
						<EditFacilitators
							courseInstance={courseInstance}
							onValueChange={onValueChange}
							facilitators={facilitators}
						/>
					)}
				</Loading.Placeholder>
			</div>
			<div className={cx('controls', 'course-panel-controls')}>
				<SaveCmp className="course-panel-continue" onSave={saveFacilitators} label={t('save')} />
				<div className="course-panel-cancel" secondary onClick={onCancel}>{t('cancel')}</div>
			</div>
		</div>
	);
}