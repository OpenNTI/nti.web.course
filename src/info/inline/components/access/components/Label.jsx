import classnames from 'classnames/bind';
import { Text, HOC } from '@nti/web-commons';

import Styles from './Label.css';

const cx = classnames.bind(Styles);

export default HOC.Variant(
	Text.Base,
	{ className: cx('course-access-label') },
	'CourseAccessLabel'
);
