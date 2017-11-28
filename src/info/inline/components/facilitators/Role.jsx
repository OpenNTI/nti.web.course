import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	assistant: 'Assistant',
	editor: 'Editor',
	instructor: 'Instructor'
};

const t = scoped('components.course.editor.inline.components.facilitators.role', LABELS);

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
