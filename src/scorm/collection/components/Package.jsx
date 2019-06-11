import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {LinkTo} from '@nti/web-routing';

import Styles from './Package.css';

const cx = classnames.bind(Styles);

export default class Package extends React.Component {
	static propTypes = {
		package: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const {package: pack, selected} = this.props;

		return (
			<LinkTo.Object className={cx('scorm-package', {selected})} object={pack}>
				{pack.title}
			</LinkTo.Object>
		);
	}
}