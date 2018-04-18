import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import DateView from '../../widgets/DateView';


const t = scoped('course.info.inline.components.enddate.View', {
	label: 'End Date'
});

export default class EndDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'EndDate';

	constructor (props) {
		super(props);
	}

	render () {
		const EndDate = this.props.catalogEntry.getEndDate();

		return (
			<DateView date={EndDate} label={t('label')}/>
		);
	}
}
