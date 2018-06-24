import React from 'react';
import PropTypes from 'prop-types';

BaseEnrolledDescription.propTypes = {
	option: PropTypes.object
};
export default function BaseEnrolledDescription ({option}) {
	return (
		<div>
			{`!!Missing Enrollment Description ${option.option.Class} for !!`}
		</div>
	);
}