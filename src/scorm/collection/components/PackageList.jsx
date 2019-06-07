import React from 'react';
import PropTypes from 'prop-types';
import {DnD} from '@nti/web-commons';

import Store from '../Store';
import {ACCEPTS_FILES} from '../Constants';

import Header from './Header';
import Package from './Package';

export default
@Store.monitor(['packages', 'selectedPackage'])
class ScormCollectionPackageList extends React.Component {
	static propTypes = {
		packages: PropTypes.array,
		selectedPackages: PropTypes.shape({
			has: PropTypes.func
		})
	}

	onFileDrop = () => {

	}

	render () {
		const {packages, selectedPackages} = this.props;

		return (
			<DnD.DropZoneIndicator
				accepts={DnD.DropZone.acceptFilesOfType(ACCEPTS_FILES)}
				onFileDrop={this.onFileDrop}
			>
				<Header />
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
			</DnD.DropZoneIndicator>
		);
	}
}