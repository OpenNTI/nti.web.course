import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';


const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Transcript Credit Hours',
	available: ' Credits Available',
	availableSingular: ' Credit Available',
	openEnrolled: 'You’re registered for the open course.',
	noCredit: '(No Credit)'
});

export default class TranscriptCreditEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		return (
			<div className="columned credit-hours">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">Editor goes here</div>
			</div>
		);
	}
}
