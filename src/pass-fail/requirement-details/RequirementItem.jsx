import './RequirementItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.pass-fail.requirements-details.RequirementItem', {
	percentage: '%(score)s%%',
	notSatisfactory: 'Not Satisfactory',
	satisfactory: 'Satisfactory',
});

const TYPES = {
	'application/vnd.nextthought.assignmentcompletionmetadata': {
		title: item => item.AssignmentTitle,
		score: item => {
			const numeric = item.getNumericUserPointsReceived();

			if (isNaN(numeric)) {
				return item.UserPointsReceived;
			}

			const score = Math.round((numeric / item.TotalPoints) * 100);

			return t('percentage', { score });
		},
		targetScore: item =>
			t('percentage', {
				score: item.CompletionRequiredPassingPercentage * 100,
			}),
	},
	'application/vnd.nextthought.scormcompletionmetadata': {
		title: item => item.ScormContentInfoTitle,
		score: item =>
			item.Success ? t('satisfactory') : t('notSatisfactory'),
		targetScore: () => '-',
	},
};

export default class RequirementItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	render() {
		const { item } = this.props;
		const type = TYPES[item.MimeType];

		if (!type) {
			return null;
		}

		return (
			<div className="requirement-item req-row">
				<div className="req-col req-item-title">{type.title(item)}</div>
				<div className="req-col req-item-score">{type.score(item)}</div>
				<div className="req-col req-item-target-score">
					{type.targetScore(item)}
				</div>
			</div>
		);
	}
}
