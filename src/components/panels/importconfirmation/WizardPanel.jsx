import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

const LABELS = {
	defaultTitle: 'Import Course',
	importInProgress: 'Import process started.  The course will automatically be updated when the process completes.',
	confirm: 'OK'
};

const t = scoped('COURSE_IMPORT', LABELS);

export default class CourseImportConfirmation extends React.Component {
	static tabName = 'Import'
	static tabDescription = 'Import Course'
	static hideHeaderControls = true;

	static propTypes = {
		saveCmp: PropTypes.func,
		afterSave: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderTitle () {
		return (<div className="course-import-header-title">{t('defaultTitle')}</div>);
	}

	onSave = (done) => {
		const { afterSave } = this.props;

		afterSave && afterSave();

		done && done();
	};

	renderSaveCmp () {
		const { saveCmp: Cmp } = this.props;

		if(Cmp) {
			return (<Cmp onSave={this.onSave} label={t('confirm')}/>);
		}

		return null;
	}

	render () {
		return (
			<div className="course-import-panel">
				<div className="course-panel-content">
					<div className="import-in-progress">{t('importInProgress')}</div>
				</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
				</div>
			</div>
		);
	}
}
