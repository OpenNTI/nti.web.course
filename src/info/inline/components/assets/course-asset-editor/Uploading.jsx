import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Header from './Header';
import Footer from './Footer';

const MIN_TIME = 5000;


const t = scoped('course.info.inline.assets.course-asset-editor.Uploading', {
	uploading: 'Uploading the course assets. This may take a few moments.',
	uploaded: 'Course assets uploaded',
	done: 'Done',
	unknownError: 'Unable to upload course assets.'
});

function getPercentage (progress, uploaded) {
	if (uploaded) { return 100; }
	if (!progress) { return 0; }

	const value = progress.loaded;
	const max = progress.total;

	return Math.round((value / (max || 1)) * 100) || (value === max ? 100 : 0);
}

export default class CourseAssetUploading extends React.Component {
	static propTypes = {
		onSave: PropTypes.func,
		onBack: PropTypes.func,
		uploadProgress: PropTypes.object,
		uploadError: PropTypes.object,
		uploaded: PropTypes.any
	}

	state = {}


	componentWillReceiveProps (nextProps) {
		const {uploadProgress:newProgress, uploaded: newUploaded, uploadError: newError} = nextProps;
		const {uploadProgress:oldProgress, uploaded: oldUploaded, uploadError: oldError} = this.props;

		if (newProgress !== oldProgress || newUploaded !== oldUploaded || newError !== oldError) {
			this.setupFor(nextProps);
		}
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props = this.props) {
		const {uploadProgress, uploaded, uploadError} = props;

		this.started = this.started || new Date();

		if (uploadError) {
			this.setState({uploadError});
			return;
		}

		if (!uploaded) {
			this.setState({uploadProgress});
			return;
		}

		const maybeFinish = () => {
			const diff = new Date() - this.started;
			const wait = Math.max(0, MIN_TIME - diff);

			if (wait <= 0) {
				this.setState({
					uploaded: true
				});
			} else {
				this.setState({
					uploadProgress: {
						loaded: diff,
						total: MIN_TIME
					}
				}, () => {
					setTimeout(maybeFinish, 100);
				});
			}
		};

		maybeFinish();
	}


	onBack = () => {
		const {onBack} = this.props;

		if (onBack) {
			onBack();
		}
	}


	onContinue = () => {
		const {onSave} = this.props;

		if (onSave) {
			onSave();
		}
	}


	render () {
		const {uploaded, uploadProgress, uploadError} = this.state;
		const disableCancel = uploadError ? false : !uploaded;

		return (
			<div className="course-asset-editor-uploading">
				<Header
					onBack={uploadError && this.onBack}
					onCancel={this.onContinue}
					cancelDisabled={disableCancel}
				/>
				<div className="progress-container">
					{this.renderProgress(uploadProgress, uploaded, uploadError)}
				</div>
				<Footer
					onContinue={this.onContinue}
					continueLabel={t('done')}
					continueDisabled={disableCancel}
					noCancel
				/>
			</div>
		);
	}


	renderProgress (progress, uploaded, uploadError) {
		if (uploadError) {
			return (
				<div className="upload-error">
					<span>{uploadError.responseText || t('unknownError')}</span>
				</div>
			);
		}

		const percentage = getPercentage(progress, uploaded);

		return (
			<div className="progress">
				<div className="message">
					{uploaded ? t('uploaded') : t('uploading')}
				</div>
				<div className={cx('bar', {uploaded})}>
					<div className="indicator" style={{width: `${percentage}%`}} />
				</div>
			</div>
		);
	}
}
