import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Template extends React.Component {
	static propTypes = {
		template: PropTypes.object.isRequired,
		onClick: PropTypes.func,
		selected: PropTypes.bool,
	};

	onTemplateClick = () => {
		const { onClick, template } = this.props;

		onClick && onClick(template);
	};

	render() {
		const { template, selected } = this.props;

		const className = cx('item', { selected });

		return (
			<div className={className} onClick={this.onTemplateClick}>
				<div className="template-icon" />
				<div className="template-name">{template.name}</div>
				<div className="template-description">
					{template.description}
				</div>
			</div>
		);
	}
}
