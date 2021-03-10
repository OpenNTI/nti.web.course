import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Input, Button, Search } from '@nti/web-commons';

import Store from '../Store';

import Styles from './Header.css';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.components.Header', {
	upload: 'Upload a SCORM Package',
});

class ScormCollectionHeader extends React.Component {
	static propTypes = {
		uploadPackage: PropTypes.func,
		filter: PropTypes.string,
		setFilter: PropTypes.func,
	};

	onFileChanged = files => {
		const { uploadPackage } = this.props;

		if (uploadPackage) {
			uploadPackage(files[0]);
		}
	};

	render() {
		const { filter, setFilter } = this.props;

		return (
			<div className={cx('scorm-collection-header')}>
				<Input.FileInputWrapper
					className={cx('upload')}
					onChange={this.onFileChanged}
				>
					<Button className={cx('scorm-upload-button')} rounded>
						<i className="icon-upload" />
						<span>{t('upload')}</span>
					</Button>
				</Input.FileInputWrapper>
				<Search
					className={cx('search')}
					value={filter}
					onChange={setFilter}
				/>
			</div>
		);
	}
}

export default decorate(ScormCollectionHeader, [
	Store.monitor(['uploadPackage', 'filter', 'setFilter']),
]);
