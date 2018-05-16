import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import CreditViewContents from '../credit/Contents';

import CreditEntry from './CreditEntry';


const t = scoped('course.info.inline.components.transcriptcredit.view', {
	label: 'Credits',
	available: ' Credits Available',
	availableSingular: ' Credit Available',
	openEnrolled: 'You’re registered for the open course.',
	noCredit: '(No Credit)'
});

export default class TranscriptCreditView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object
	}

	static FIELD_NAME = 'credits';

	constructor (props) {
		super(props);

		this.state = {
			entries: props.catalogEntry.credits
		};
	}

	renderEntry = (entry) => {
		return (
			<CreditEntry
				key={entry.creditDefinition.type + ' ' + entry.creditDefinition.unit}
				entry={entry}
			/>
		);
	}

	renderTranscriptCredits () {
		if(!this.state.entries || this.state.entries.length === 0) {
			if(this.hasLegacyCredit()) {
				return null;
			}

			return (
				<div className="content">
					{t('noCredit')}
				</div>
			);
		}

		return (
			<div className="content">
				<div className="credit-entries">
					{this.state.entries.map(this.renderEntry)}
				</div>
			</div>
		);
	}

	hasLegacyCredit () {
		return Boolean(this.props.catalogEntry[CreditViewContents.FIELD_NAME] && this.props.catalogEntry[CreditViewContents.FIELD_NAME][0]);
	}

	renderContent () {
		return (
			<div className="credits-container">
				{
					this.hasLegacyCredit() && (
						<div className="legacy-credits">
							<CreditViewContents {...this.props}/>
						</div>
					)
				}
				{this.renderTranscriptCredits()}
			</div>
		);
	}

	render () {
		return (
			<div className="columned transcript-credit-hours">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">{this.renderContent()}</div>
			</div>
		);
	}
}