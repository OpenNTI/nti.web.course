import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, DisplayName} from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';

const t = scoped('course.components.UserGradeCard', {
	assignGrade: 'Assign Final Grade',
	notAvailable: '-'
});

export default class UserGradeCard extends React.Component {
	static propTypes = {
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		grade: PropTypes.number,
		onAssignGrade: PropTypes.func,
		assignable: PropTypes.bool
	}

	onAssignClick = () => {
		const { onAssignGrade } = this.props;

		onAssignGrade && onAssignGrade();
	}

	renderAssignGrade () {
		if(this.props.assignable) {
			return <div className="assign-grade" onClick={this.onAssignClick}>{t('assignGrade')}</div>;
		}

		return <div className="sub-info">{this.props.user}</div>;
	}

	render () {
		const { user, grade } = this.props;

		return (
			<div className="user-grade-card">
				<div className="avatar-container">
					<Avatar className="avatar" entity={user}/>
					<div className="grade-container">
						<div className="grade">{grade || t('notAvailable')}</div>
					</div>
				</div>
				<div className="user-name"><DisplayName entity={user}/></div>
				{this.renderAssignGrade()}
			</div>
		);
	}
}
