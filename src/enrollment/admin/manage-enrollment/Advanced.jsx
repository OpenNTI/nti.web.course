import './Advanced.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Input, Button} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.admin.manage-enrollment.advanced', {
	heading: 'Advanced',
	label: 'Scope',
	placeholder: 'Enter Scope',
	button: 'Enroll User'
});

export default class CourseEnrollmentAdminManageAdvanced extends React.Component {
	static propTypes = {
		enrollInScope: PropTypes.func
	}

	state = {showing: false, scope: ''}


	toggleShowing = () => {
		this.setState({
			showing: !this.state.showing
		});
	}


	onScopeChange = (scope, e) => {
		e.stopPropagation();
		e.preventDefault();

		this.setState({
			scope
		});
	}


	onEnrollInScope = () => {
		const {enrollInScope} = this.props;
		const {scope} = this.state;

		if (enrollInScope) {
			enrollInScope(scope);
		}
	}


	render () {
		const {showing, scope} = this.state;

		return (
			<fieldset className={cx('nti-course-enrollment-admin-manage-advanced', {showing})} >
				<legend className="heading" onClick={this.toggleShowing}><span>{t('heading')}</span><i className="icon-chevron-down" /></legend>
				<div className="content">
					<div className="manual-scope">
						<Input.Label label={t('label')}>
							<Input.Clearable>
								<Input.Text value={scope} onChange={this.onScopeChange} placeholder={t('placeholder')} />
							</Input.Clearable>
						</Input.Label>
						<Button rounded disabled={!scope} onClick={this.onEnrollInScope}>{t('button')}</Button>
					</div>
				</div>
			</fieldset>
		);
	}
}
