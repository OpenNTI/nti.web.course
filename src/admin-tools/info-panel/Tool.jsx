import './Tool.scss';
import PropTypes from 'prop-types';

import { LinkTo } from '@nti/web-routing';

const Tool = ({ title, bundle, subtitle, icon, link }) => (
	<div className="admin-info-tool">
		<div className="tool-icon-wrapper">
			{typeof icon === 'string' ? (
				<img className="tool-icon" src={icon} />
			) : (
				icon
			)}
		</div>
		<div className="tool-content">
			<div className="tool-title">{title}</div>
			<div className="tool-subtitle">{subtitle}</div>
			<LinkTo.Object context={link} object={bundle} className="tool-link">
				View Now
			</LinkTo.Object>
		</div>
	</div>
);

Tool.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	link: PropTypes.string.isRequired,
	bundle: PropTypes.object.isRequired,
};

export default Tool;
