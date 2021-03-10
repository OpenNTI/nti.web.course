import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Loading, Layouts } from '@nti/web-commons';
import { Registry as BaseRegistry } from '@nti/lib-commons';

import TypeRegistry from '../Registry';

import Styles from './View.css';
import Sidebar from './Sidebar';

const { Aside } = Layouts;
const cx = classnames.bind(Styles);

function getMissingMessage(location) {
	const { item } = location;

	return `Unknown Item Type: ${item.MimeType}`;
}

export default class CourseContentViewerDefaultType extends React.Component {
	static propTypes = {
		location: PropTypes.object,
	};

	render() {
		const { location } = this.props;

		return (
			<div className={cx('container')}>
				<Aside component={Sidebar} />
				{!location && <Loading.Spinner.Large />}
				{location && (
					<span className={cx('missing-text')}>
						{getMissingMessage(location)}
					</span>
				)}
			</div>
		);
	}
}

TypeRegistry.register(BaseRegistry.Default)(CourseContentViewerDefaultType);
