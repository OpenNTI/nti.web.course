import './Item.scss';
import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';

export default class CourseEnrollmentGiftingItem extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		label: PropTypes.string,
	};

	render() {
		const { title, label } = this.props;

		return (
			<PaddedContainer className="nti-course-enrollment-gifting-item">
				<div className="meta">
					{title && <div className="title">{title}</div>}
					{label && <div className="label">{label}</div>}
				</div>
				<i className="icon-chevron-right" />
			</PaddedContainer>
		);
	}
}
