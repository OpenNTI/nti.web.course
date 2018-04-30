import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import CreditEntry from './CreditEntry';


const t = scoped('course.info.inline.components.transcriptcredit.view', {
	label: 'Transcript Credit Hours',
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

	constructor (props) {
		super(props);

		//TODO: transcripts - get entries from course
		this.state = {
			entries: [
				{value: 15, type: 'ECTS points'}
			]
		};
	}

	renderEntry = (entry) => {
		return (
			<CreditEntry
				key={entry.type}
				entry={entry}
			/>
		);
	}

	renderContent () {
		return (
			<div className="content">
				<div className="credit-entries">
					{(this.state.entries || []).map(this.renderEntry)}
				</div>
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
