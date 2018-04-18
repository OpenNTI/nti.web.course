import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';


const t = scoped('course.info.inline.components.facilitators.Role', {
	assistant: 'Assistant',
	editor: 'Editor',
	instructor: 'Instructor'
});

export default class Role extends React.Component {
	static propTypes = {
		role: PropTypes.string.isRequired,
		onClick: PropTypes.func
	}

	onRoleClick = () => {
		const { onClick, role } = this.props;

		onClick && onClick(role);
	};

	render () {
		const { role } = this.props;

		const text = t(role);

		return (<div className="role-option" onClick={this.onRoleClick}>{text}</div>);
	}
}
