import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import DateView from '../../widgets/DateView';

import Disclaimer from './Disclaimer';

const t = scoped('course.info.inline.components.enddate.View', {
	label: 'End Date',
});

export default class EndDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool,
	};

	static FIELD_NAME = 'EndDate';

	constructor(props) {
		super(props);
	}

	render() {
		const { editable, catalogEntry } = this.props;
		const EndDate = catalogEntry.getEndDate();

		return (
			<DateView
				date={EndDate}
				label={t('label')}
				disclaimer={editable ? <Disclaimer /> : null}
			/>
		);
	}
}
