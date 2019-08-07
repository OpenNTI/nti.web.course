import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import DateView from '../../widgets/DateView';

import Disclaimer from './Disclaimer';

const t = scoped('course.info.inline.components.startdate.View', {
	label: 'Start Date'
});

export default class StartDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);
	}

	render () {
		const {catalogEntry, editable} = this.props;
		const StartDate = catalogEntry.getStartDate();

		return (
			<DateView
				date={StartDate}
				label={t('label')}
				disclaimer={editable ? (<Disclaimer />) : null}
			/>
		);
	}
}
