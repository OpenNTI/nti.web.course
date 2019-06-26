import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import Title from '../../common/Title';
import SubTitle from '../../common/SubTitle';

import Styles from './Uploading.css';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.components.package.Uploading', {
	uploading: 'Uploading',
	cancel: 'Cancel',
});

export default
class UploadingPackage extends React.PureComponent {
	static propTypes = {
		package: PropTypes.object.isRequired
	}

	onCancel = () => {
		const {package: task} = this.props;

		if (task.canCancel) {
			task.cancel();
		}
	}

	render () {
		const {package: task} = this.props;

		if (!task) { return null; }

		return (
			<div className={cx('uploading-package')}>
				<div className={cx('icon')} />
				<div className={cx('title-container')}>
					<Title>{task.name}</Title>
					<SubTitle className={cx('sub-title')} blue>{t('uploading')}</SubTitle>
				</div>
				{task.canCancel && (<div className={cx('cancel')} onClick={this.onCancel} role="button">{t('cancel')}</div>)}
				{this.renderProgress(task)}
			</div>
		);
	}

	renderProgress (task) {
		if (!task.hasProgress) { return null; }

		const {progress} = task;
		const {current, total} = progress;

		const percent = (current / total) * 100;
		const style = {
			width: `${Math.round(percent || 0)}%`
		};

		return (
			<div className={cx('progress')} style={style} />
		);
	}
}