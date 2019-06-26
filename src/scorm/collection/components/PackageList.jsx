import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {DnD, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from '../Store';
import {ACCEPTS_FILES} from '../Constants';

import Styles from './PackageList.css';
import Container from './PaddedContainer';
import Header from './Header';
import Package from './package';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.components.PackageList', {
	empty: {
		filtered: 'No SCORM packages match your search term.',
		notFiltered: 'No SCORM packages available.'
	}
});

export default
@Store.monitor(['packages', 'filter', 'upload', 'uploadError', 'uploadPackage', 'clearUploadError'])
class ScormCollectionPackageList extends React.Component {
	static propTypes = {
		packages: PropTypes.array,
		filter: PropTypes.string,
		selectedPackages: PropTypes.shape({
			has: PropTypes.func
		}),
		uploadPackage: PropTypes.func
	}

	onFileDrop = (e, files) => {
		const {uploadPackage} = this.props;

		if (uploadPackage && files[0]) {
			uploadPackage(files[0]);
		}
	}

	render () {
		const {packages, selectedPackages, filter} = this.props;
		const empty = !packages || !packages.length;

		return (
			<DnD.DropZoneIndicator
				className={cx('package-list-container')}
				accepts={DnD.DropZone.acceptFilesOfType(ACCEPTS_FILES)}
				onFileDrop={this.onFileDrop}
			>
				<Container>
					<Header />
					{empty && this.renderEmpty(filter)}
					{!empty && this.renderPackages(packages, selectedPackages)}
				</Container>
			</DnD.DropZoneIndicator>
		);
	}

	renderEmpty (filter) {
		const header = filter ? t('empty.filtered') : t('empty.notFiltered');

		return (
			<EmptyState subHeader={header} />
		);
	}

	renderPackages (packages, selectedPackages) {
		return (
			<ul className={cx('package-list')}>
				{packages.map((pack, index) => {
					const isSelected = selectedPackages && selectedPackages.has(pack.scormId);

					return (
						<li key={pack.scormId || index}>
							<Package package={pack} selected={isSelected} />
						</li>
					);
				})}
			</ul>
		);
	}
}