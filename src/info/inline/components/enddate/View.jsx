import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import DateView from '../../widgets/DateView';

const LABELS = {
	label: 'End Date'
};

const t = scoped('components.course.editor.inline.components.enddate.view', LABELS);

export default class EndDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'EndDate';

	constructor (props) {
		super(props);
	}

	render () {
		const { EndDate } = this.props.catalogEntry;

		return (
			<DateView date={EndDate} label={t('label')}/>
		);
	}
}
