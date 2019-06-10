import React from 'react';
import PropTypes from 'prop-types';
import {DnD, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from '../Store';
import {ACCEPTS_FILES} from '../Constants';

import Header from './Header';
import Package from './Package';

const t = scoped('course.scorm.collection.components.PackageList', {
	empty: {
		filtered: 'No SCORM packages match your search term.',
		notFiltered: 'No SCORM packages available.'
	}
});

export default
@Store.monitor(['packages', 'selectedPackage', 'filter'])
class ScormCollectionPackageList extends React.Component {
	static propTypes = {
		packages: PropTypes.array,
		filter: PropTypes.string,
		selectedPackages: PropTypes.shape({
			has: PropTypes.func
		})
	}

	onFileDrop = () => {

	}

	render () {
		const {packages, selectedPackages, filter} = this.props;
		const empty = !packages || !packages.length;

		return (
			<DnD.DropZoneIndicator
				accepts={DnD.DropZone.acceptFilesOfType(ACCEPTS_FILES)}
				onFileDrop={this.onFileDrop}
			>
				<Header />
				{empty && this.renderEmpty(filter)}
				{!empty && this.renderPackages(packages, selectedPackages)}
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
			<ul>
				{packages.map((pack) => {
					const isSelected = selectedPackages && selectedPackages.has(pack.scormId);

					return (
						<li key={pack.scormId}>
							<Package package={pack} selected={isSelected} />
						</li>
					);
				})}
			</ul>
		);
	}
}