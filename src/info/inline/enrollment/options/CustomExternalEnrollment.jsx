import PropTypes from 'prop-types';

import OptionText, { TITLE, DESCRIPTION } from '../common/OptionText';

import ExternalEnrollment from './ExternalEnrollment';

CustomExternalEnrollment.propTypes = {
	option: PropTypes.object.isRequired,
};

export default function CustomExternalEnrollment(props) {
	const { option } = props;

	return (
		<ExternalEnrollment
			customTitle={OptionText.getContentFor(option, TITLE)}
			customDescription={OptionText.getContentFor(option, DESCRIPTION)}
			className="custom"
			{...props}
		/>
	);
}
