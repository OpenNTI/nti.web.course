import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Flyout} from '@nti/web-commons';

import {default as Role, RoleLabel} from './Role';

const t = scoped('course.info.inline.components.facilitators.roleFlyoutSelect', {
	heading: 'Choose a Role'
});

export default class RoleSelect extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
		options: PropTypes.array,
		value: PropTypes.any
	}

	onRoleSelect = role => {
		const {onChange} = this.props;

		if (onChange && role !== this.props.value) {
			onChange(role);
		}

		this.roleFlyout && this.roleFlyout.dismiss();
	}

	renderRoleTrigger () {
		const {value: role} = this.props;

		return (
			<div className="trigger">
				<RoleLabel role={role} />
				<i className="icon-chevron-down"/>
			</div>
		);	
	}

	renderRoleOption = (role) => {
		return <Role role={role} key={role} onClick={this.onRoleSelect}/>;
	}

	attachRoleFlyoutRef = x => this.roleFlyout = x

	render () {
		const {options} = this.props;

		return (
			<Flyout.Triggered
				className="course-facilitator-role-flyout"
				trigger={this.renderRoleTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachRoleFlyoutRef}
			>
				<div>
					<div className="facilitator-flyout-heading">{t('heading')}</div>
					{options.map(this.renderRoleOption)}
				</div>
			</Flyout.Triggered>
		);
	}
}
