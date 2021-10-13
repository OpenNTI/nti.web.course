import classnames from 'classnames/bind';

import Styles from './RadioGroup.css';

const cx = classnames.bind(Styles);

export default function RadioGroup(props) {
	return <div {...props} className={cx('radio-group')} />;
}
