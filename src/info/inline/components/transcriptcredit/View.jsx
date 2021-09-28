import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import { CreditViewContents } from '../credit/Contents';

import Disclaimer from './Disclaimer';
import Store from './managetypes/Store';
import CreditEntry from './CreditEntry';

const t = scoped('course.info.inline.components.transcriptcredit.view', {
	label: 'Credits',
	available: ' Credits Available',
	availableSingular: ' Credit Available',
	openEnrolled: 'You’re registered for the open course.',
	noCredit: '(No Credit)',
});

TranscriptCreditView.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	enrollmentAccess: PropTypes.object,
	editable: PropTypes.bool,
};

TranscriptCreditView.FIELD_NAME = 'credits';

function TranscriptCreditView({ catalogEntry, enrollmentAccess, editable }) {
	const entries = catalogEntry?.credits;
	const hasLegacyCredit = Boolean(catalogEntry?.Credit?.[0]);

	return (
		<div className="columned transcript-credit-hours">
			<div className="field-info">
				<div className="date-label">{t('label')}</div>
				{editable && <Disclaimer />}
			</div>
			<div className="content-column">
				<div className="credits-container">
					{hasLegacyCredit && (
						<div className="legacy-credits">
							<CreditViewContents
								{...{ catalogEntry, enrollmentAccess }}
							/>
						</div>
					)}
					{!entries?.length ? (
						hasLegacyCredit ? null : (
							<div className="content">{t('noCredit')}</div>
						)
					) : (
						<div className="content">
							<div className="credit-entries">
								{entries.map(entry => (
									<CreditEntry
										entry={entry}
										key={entry.creditDefinition.toString()}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export const View = Store.compose(TranscriptCreditView);
