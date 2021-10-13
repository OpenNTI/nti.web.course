import './Container.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

CourseProgressContainer.propTypes = {
	className: PropTypes.string,
};
export default function CourseProgressContainer({ className, ...otherProps }) {
	return (
		<div
			className={cx('course-progress-container', className)}
			{...otherProps}
		/>
	);
}
