import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

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

		this.state = {};
	}

	render () {
		const { EndDate } = this.props.catalogEntry;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">{(EndDate && DateTime.format(EndDate)) || '-'}</div>
			</div>
		);
	}
}
