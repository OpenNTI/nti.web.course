import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {AssetIcon, Layouts} from '@nti/web-commons';

import TypeRegistry from '../Registry';

import Styles from './View.css';
import Action from './Action';

const {Aside, Responsive} = Layouts;
const cx = classnames.bind(Styles);

const MIME_TYPES = {
	'application/vnd.nextthought.scormcontentref': true
};

const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default
@TypeRegistry.register(handles)
class CourseContentViewerRendererScorm extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			item: PropTypes.object
		}),
		course: PropTypes.object
	}

	render () {
		const {course, location} = this.props;
		const {item} = location || {};

		return (
			<section className={cx('scorm-content')}>
				<div className={cx('header')}>
					<AssetIcon className={cx('asset-icon')} src={item.icon} mimeType={item.MimeType} />
					<div className={cx('title')}>{item.title}</div>
				</div>
				<div className={cx('description')}>
					{item.description}
				</div>
				<Responsive.Item query={Responsive.isMobileContext} render={this.renderMobileAction} course={course} item={item} />
				<Responsive.Item query={Responsive.isWebappContext} render={this.renderWebAction} course={course} item={item} />
			</section>
		);
	}


	renderMobileAction (props) {
		return (
			<Action {...props} />
		);
	}


	renderWebAction (props) {
		return (
			<Aside component={Action} {...props} />
		);
	}
}