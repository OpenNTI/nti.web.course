import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {getService} from 'nti-web-client';

const LABELS = {
	cancel: 'Cancel'
};

const t = scoped('components.course.info.inline.assets.courseimageeditor', LABELS);


export default class CourseImageEditor extends React.Component {
	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string
	}

	onSave = async () => {
		const { afterSave, catalogEntry } = this.props;

		const service = getService();
		const formData = new FormData();
		// formData.append(file.name, file);
		// await service.put(catalogEntry.getLink('edit'), formData);

		afterSave && afterSave();
	}

	renderSaveCmp () {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if(Cmp) {
			return (<Cmp onSave={this.onSave} label={buttonLabel}/>);
		}

		return null;
	}

	renderCancelCmp () {
		if(this.props.onCancel) {
			return (<div className="course-panel-cancel" onClick={this.props.onCancel}>{t('cancel')}</div>);
		}
	}

	render () {
		return (
			<div>
				<div className="editor-content">Image editor and previews go here</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}
