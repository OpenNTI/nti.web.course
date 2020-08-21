import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Contents from './Contents';


const t = scoped('course.info.inline.components.credit.view', {
	label: 'Credit Hours'
});

export default class CreditView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object
	}

	static FIELD_NAME = 'Credit';

	static hasData (catalogEntry) {
		const schedule = catalogEntry[CreditView.FIELD_NAME];

		const info = schedule && schedule[0];

		return info && info.Hours;
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
				<div className="content-column"><Contents {...this.props}/></div>
			</div>
		);
	}
}
