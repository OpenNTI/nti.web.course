import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import { CreditViewContents as Contents } from './Contents';

const t = scoped('course.info.inline.components.credit.view', {
	label: 'Credit Hours',
});

CreditView.FIELD_NAME = 'Credit';
CreditView.hasData = catalogEntry => catalogEntry?.Credit?.[0]?.Hours;
CreditView.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	enrollmentAccess: PropTypes.object,
};

export default function CreditView({ catalogEntry, enrollmentAccess }) {
	return (
		<div className="columned credit-hours">
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
			</div>
			<div className="content-column">
				<Contents {...{ catalogEntry, enrollmentAccess }} />
			</div>
		</div>
	);
}
