import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import DateView from '../../widgets/DateView';


const t = scoped('course.info.inline.components.startdate.View', {
	label: 'Start Date'
});

export default class StartDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);
	}

	render () {
		const StartDate = this.props.catalogEntry.getStartDate();

		return (
			<DateView date={StartDate} label={t('label')}/>
		);
	}
}
