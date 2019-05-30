import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {toCSSClassName} from '@nti/lib-dom';

import {ROLES} from './utils';

const t = scoped('course.info.inline.components.facilitators.Role', {
	[ROLES.INSTRUCTOR]: 'Full Access',
	[ROLES.ASSISTANT]: 'Grading Access',
	[ROLES.EDITOR]: 'Editing Access',
});

export {t as getText};

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
		return (<div className="role-option" onClick={this.onRoleClick}><RoleLabel role={role} /></div>);
	}
}

export const RoleLabel = ({role}) => <span className={toCSSClassName(`role-label-${role}`)}>{t(role)}</span>;

RoleLabel.propTypes = {
	role: PropTypes.string.isRequired
};
