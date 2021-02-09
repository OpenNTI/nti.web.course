import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Layouts} from '@nti/web-commons';

import TypeRegistry from '../Registry';

import Body from './Body';
import Header from './Header';
import Action from './Action';
import Styles from './View.css';

const cx = classnames.bind(Styles);

const {Aside, Responsive} = Layouts;

const MIME_TYPES = {
	'application/vnd.nextthought.webinarasset': true
};

const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class NTICourseContentViewerWebinar extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			item: PropTypes.object
		}),
		course: PropTypes.object.isRequired
	}


	render () {
		const {course, location} = this.props;
		const {item} = location || {};

		return (
			<section className={cx('webinar-container')}>
				<Header item={item} />
				<Body item={item} />
				<Responsive.Item query={Responsive.isMobileContext} render={this.renderMobileAction} course={course} item={item} />
				<Responsive.Item query={Responsive.isWebappContext} render={this.renderWebAction} course={course} item={item} />
			</section>
		);
	}


	renderMobileAction ({course, item}) {
		return (
			<Action course={course} item={item} />
		);
	}


	renderWebAction ({course, item}) {
		return (
			<Aside component={Action} course={course} item={item} />
		);
	}
}

TypeRegistry.register(handles)(NTICourseContentViewerWebinar);
