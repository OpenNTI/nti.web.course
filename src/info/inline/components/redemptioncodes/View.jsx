import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Disclaimer from './Disclaimer';

const t = scoped('course.info.inline.components.redemptioncodes.View', {
	label: 'Redemption Code',
});

RedemptionCodesView.propTypes = {
	redemptionCodes: PropTypes.object,
};

// no static FIELD_NAME, codes are pulled through the API, not off the object directly

export default function RedemptionCodesView({ redemptionCodes }) {
	return (
		<div className="columned">
			<div className="field-info">
				<div className="date-label">
					<span>{t('label')}</span>
				</div>
				<Disclaimer />
			</div>
			<div className="content-column">
				{!redemptionCodes?.length ? (
					<div>None</div>
				) : (
					<div>
						{redemptionCodes.map(code => (
							<div key={code.Code} className="redemption-code">
								{code.Code}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
