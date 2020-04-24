import classnames from 'classnames/bind';
import {Errors, HOC} from '@nti/web-commons';

import Styles from './Error.css';

const cx = classnames.bind(Styles);

export default HOC.Variant(Errors.Message, {className: cx('course-access-error')}, 'CourseAccessError');