import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	label: 'Redemption Code'
};

const t = scoped('components.course.editor.inline.components.redemptioncodes.view', LABELS);

export default class RedemptionCodesView extends React.Component {
	static propTypes = {
		redemptionCodes: PropTypes.arrayOf(PropTypes.object)
	}

	// no static FIELD_NAME, codes are pulled through the API, not off the object directly

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderCode = (code) => {
		return (<div key={code.Code} className="redemption-code">{code.Code}</div>);
	}

	renderCodes () {
		const { redemptionCodes } = this.props;

		if(!redemptionCodes || redemptionCodes.length === 0) {
			return (<div>None</div>);
		}

		return (<div>{redemptionCodes.map(this.renderCode)}</div>);
	}

	render () {
		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">{this.renderCodes()}</div>
			</div>
		);
	}
}
