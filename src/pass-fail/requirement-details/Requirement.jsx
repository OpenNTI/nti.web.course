import './Requirement.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import RequirementItem from './RequirementItem';

const t = scoped('course.pass-fail.requirement-details.Requirement', {
	score: 'Your Score',
	targetScore: 'Target Score',
});

export default class Requirement extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		items: PropTypes.array,
	};

	render() {
		const { title, items } = this.props;
		return (
			<div className="requirement">
				<header className="requirement-header">
					<div className="req-col requirement-main">{title}</div>
					<div className="req-col score">{t('score')}</div>
					<div className="req-col target-score">
						{t('targetScore')}
					</div>
				</header>
				<div className="requirement-contents">
					{items &&
						items.map(x => (
							<RequirementItem key={x.AssignmentNTIID} item={x} />
						))}
				</div>
			</div>
		);
	}
}
