import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {getService} from 'nti-web-client';
import {ImageEditor} from 'nti-web-whiteboard';

import Preview from './Preview';

const LABELS = {
	cancel: 'Cancel'
};

const t = scoped('components.course.info.inline.assets.courseimageeditor', LABELS);

// temp mock data
const PREVIEWS = [
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '1:1'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '2:3'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '5:6'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '3:4'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '11:14'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '4:3'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: '5:3'
	},
	{
		imageSrc: 'https://coavacoffee.com/uploads/producer_mancia_full_161114_090824.jpg',
		label: 'BLUR BG'
	}
];

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

	renderPreview = (preview) => {
		// TODO add image
		return <Preview key={preview.label} label={preview.label} imageSrc={preview.imageSrc}/>;
	}

	renderPreviewBar () {
		return (
			<div className="preview-bar">
				{PREVIEWS.map(this.renderPreview)}
			</div>
		);
	}

	render () {
		return (
			<div>
				{this.renderPreviewBar()}
				<div className="editor-content"><ImageEditor/></div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}
