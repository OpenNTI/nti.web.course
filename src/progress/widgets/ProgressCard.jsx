import './ProgressCard.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import {CircularProgress} from '@nti/web-charts';

const t = scoped('course.components.ProgressCard', {
	courseProgress: 'Your Course Progress',
	finishingUp: 'Finishing Up',
	remaining: '%(remaining)s remaining'
});

export default class ProgressCard extends React.Component {
	static propTypes = {
		completed: PropTypes.number,
		total: PropTypes.number
	}

	renderStatus () {
		//const { total, completed } = this.props;

		return <div className="status">{t('finishingUp')}</div>;
	}

	renderProgressCircle () {
		const { completed, total } = this.props;

		const pctCompleted = total ? parseInt(100 * (completed / total), 10) : 0;

		return (
			<CircularProgress
				value={pctCompleted}
				showPctSymbol={false}
				lineThickness={3}
				width={104}
				height={104}/>
		);
	}

	renderRemaining () {
		const { completed, total } = this.props;

		return <div className="remaining">{t('remaining', { remaining: total - completed })}</div>;
	}

	render () {
		return (
			<div className="progress-card">
				<div className="header-label">{t('courseProgress')}</div>
				{this.renderProgressCircle()}
				{this.renderStatus()}
				{this.renderRemaining()}
			</div>
		);
	}
}
