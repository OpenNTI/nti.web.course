import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	label: 'Start Date'
};

const t = scoped('components.course.editor.inline.components.startdate.view', LABELS);

export default class StartDateView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		const { StartDate } = this.props.catalogEntry;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">{(StartDate && DateTime.format(StartDate)) || '-'}</div>
			</div>
		);
	}
}
