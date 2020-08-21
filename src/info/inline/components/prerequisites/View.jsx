import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';


const t = scoped('course.info.inline.components.prerequisites.View', {
	label: 'Prerequisites',
	none: 'None'
});

export default class PrerequisitesView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'Prerequisites';

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderPrereq = (pre) => {
		return (<div className="prerequisite" key={pre.id}>{pre.title}</div>);
	}

	renderContent () {
		const { catalogEntry } = this.props;

		if(!catalogEntry[PrerequisitesView.FIELD_NAME] || catalogEntry[PrerequisitesView.FIELD_NAME].length === 0) {
			return (<div className="content-column">{t('none')}</div>);
		}

		return (
			<div className="content-column">
				{catalogEntry[PrerequisitesView.FIELD_NAME].map(this.renderPrereq)}
			</div>
		);
	}

	render () {
		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				{this.renderContent()}
			</div>
		);
	}
}
