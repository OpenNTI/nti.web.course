import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Prompt} from '@nti/web-commons';

import {Invite as InviteForm} from '../enrollment';

import Store from './Store';
import styles from './Invite.css';

const cx = classnames.bind(styles);
const t = scoped('course.roster.invite', {
	buttonLabel: 'Invite'
});

export default
@Store.monitor({
	course: 'course'
})
class Invite extends React.Component {

	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {}
	showDialog = () => this.setState({showDialog: true})
	hideDialog = () => this.setState({showDialog: false})

	render () {
		const {
			props: {course},
			state: {showDialog}
		} = this;

		const {canInvite} = (course || {});

		return !canInvite ? null : (
			<>
				<button className={cx('invite-button')} onClick={this.showDialog}>
					<i className={cx('icon-addfriend')} /> {t('buttonLabel')}
				</button>

				{showDialog && (
					<Prompt.Dialog onBeforeDismiss={this.hideDialog}>
						<InviteForm
							course={course}
							onSuccess={this.hideDialog}
							onCancel={this.hideDialog}
						/>
					</Prompt.Dialog>
				)}
			</>
		);
	}
}