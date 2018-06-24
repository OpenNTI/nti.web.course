import React from 'react';
import PropTypes from 'prop-types';


BaseEnrolledTitle.propTypes = {
	option: PropTypes.object
};
export default function BaseEnrolledTitle ({option}) {
	return (
		<div>
			{`!!Missing Enrollment Title ${option.option.Class} for !!`}
		</div>
	);
}