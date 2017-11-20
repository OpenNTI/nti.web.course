import React from 'react';
import PropTypes from 'prop-types';
import {Presentation, Prompt} from 'nti-web-commons';
import cx from 'classnames';

export default class AssetType extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		type: PropTypes.string.isRequired
	}

	launchImgDialog = () => {
		const { catalogEntry, type } = this.props;

		Prompt.modal(
			<div className="large-asset-preview">
				<Presentation.Asset contentPackage={catalogEntry} propName="src" type={type}>
					<img/>
				</Presentation.Asset>
			</div>
		);
	}

	render () {
		const { catalogEntry, type } = this.props;

		const className = cx('asset', type);

		return (<div className={className}>
			<div className="asset-label">{type}</div>
			<Presentation.Asset contentPackage={catalogEntry} propName="src" type={type}>
				<img onClick={this.launchImgDialog}/>
			</Presentation.Asset>
		</div>);
	}
}
