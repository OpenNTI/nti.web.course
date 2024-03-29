import './AssignmentLabel.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { List, DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Required from '../../common/Required';
import RequirementControl from '../../../../progress/widgets/RequirementControl';

const t = scoped(
	'course.overview.lesson.overview.question-set.AssignmentLabel',
	{
		draft: 'Draft',
		maxTime: '%(maxTime)s time limit',
		attempts: {
			notStarted: {
				limitedAttempts: {
					zero: 'No Attempts',
					one: '%(count)s Attempt',
					other: '%(count)s Attempts',
				},
				unlimitedAttempts: 'Unlimited Attempts',
			},
			started: {
				failed: {
					limitedAttempts: {
						zero: 'Not Satisfactory, No Attempts Remaining',
						one: 'Not Satisfactory, %(count)s Attempt Remaining',
						other: 'Not Satisfactory, %(count)s Attempts Remaining',
					},
					unlimitedAttempts:
						'Not Satisfactory, Unlimited Attempts Remaining',
				},
			},
		},
		failed: {
			limitedAttempts: {
				zero: 'Not Satisfactory, No Attempts Remaining',
				one: 'Not Satisfactory, %(count)s Attempt Remaining',
				other: 'Not Satisfactory, %(count)s Attempts Remaining',
			},
			unlimitedAttempts: 'Not Satisfactory, Unlimited Attempts Remaining',
		},
		completed: {
			label: 'completed ',
			noCompletion: 'Pending Grade ',
			graded: 'graded ',
			submittedAt: 'Submitted At %(date)s',
			overTime: 'overtime',
			overDue: 'overdue',
			overTimeTip: '%(time)s overtime',
			overDueTip: '%(time)s overdue',
			modOpen: '(',
			modClose: ') ',
			modSeparator: ', ',
		},
		due: {
			today: 'Due Today at %(time)s',
			due: 'Due %(date)s',
			availableNow: 'Available Now',
			available: 'Available %(date)s',
		},
		excused: {
			label: 'Excused Grade',
			tip: 'This assignment will NOT count towards your grade',
		},
	}
);

const getNaturalDuration = (...args) => DateTime.getNaturalDuration(...args);
const isToday = (...args) => DateTime.isToday(...args);

export default class LessonOverviewAssignmentLabel extends React.Component {
	static propTypes = {
		overviewItemRef: PropTypes.object,
		assignment: PropTypes.object,
		assignmentHistory: PropTypes.object,
		required: PropTypes.bool,
		onInlineEditorExpanded: PropTypes.func,
		statusExpanded: PropTypes.bool,
		onRequirementChange: PropTypes.func,
		editMode: PropTypes.bool,
	};

	state = {};

	componentDidMount() {
		this.setup(this.props);
	}

	componentDidUpdate(prevProps) {
		// TODO: We should check lastModified time to know if an update is even needed.  However, lastModified is not getting properly updated right now

		const {
			assignment: newAssignment,
			assignmentHistory: newHistory,
			statusExpanded,
		} = this.props;
		const {
			assignment: oldAssignment,
			assignmentHistory: oldHistory,
			statusExpanded: oldExpanded,
		} = prevProps;

		if (
			newAssignment !== oldAssignment ||
			newHistory !== oldHistory ||
			statusExpanded !== oldExpanded
		) {
			this.setup(this.props);
		}

		// this.setupFor(this.props);
	}

	setup(props = this.props) {
		const { assignment: a, assignmentHistory: h } = props;
		const canEdit = a.hasLink('date-edit') || a.hasLink('edit');

		const state = {
			now: new Date(),
			availableDate: a && a.getAssignedDate(),
			dueDate: a && a.getDueDate(),
			isNoSubmit:
				(a && a.isNonSubmit()) || (h && h.isSyntheticSubmission()),
			isSynthetic: h && h.isSyntheticSubmission(),
			isDraft: a && !a.isPublished(),

			isTimed: a && a.isTimed,
			maxTime:
				a &&
				a.isTimed &&
				a.getMaximumTimeAllowed &&
				a.getMaximumTimeAllowed(),
			duration: a && a.isTimed && a.getDuration && a.getDuration(),

			maxSubmissions: a && a.maxSubmissions,
			submissionCount: a && a.submissionCount,

			isSubmitted: h && h.isSubmitted(),
			completedDate:
				(!canEdit || a?.CompletedItem) &&
				(h?.Submission?.getCreatedTime() ??
					a?.CompletedItem?.getCompletedDate()),
			isExcused: h && h.grade && h.grade.isExcused(),
			assignmentModified: a.getLastModified().getTime(),

			hasCompletion: Boolean(a && a.CompletedItem),
			failed: a?.CompletedItem?.Success === false,
		};

		this.setState(state);
	}

	render() {
		return (
			<List.SeparatedInline className="lesson-overview-assignment-status">
				{this.renderRequired()}
				{this.renderAttempts()}
				{this.renderDraft()}
				{this.renderTimed()}
				{this.renderCompletion()}
				{this.renderDue()}
				{this.renderExcused()}
			</List.SeparatedInline>
		);
	}

	renderDraft() {
		const { isDraft } = this.state;
		const { editMode, assignment } = this.props;

		if (
			isDraft &&
			editMode &&
			assignment &&
			assignment.getDateEditingLink()
		) {
			const className = this.props.statusExpanded
				? 'icon-chevron-up'
				: 'icon-chevron-down';

			// render editable widget
			return (
				<span onClick={this.onStatusClick}>
					<span className="draft">{t('draft')}</span>
					<i className={className} />
				</span>
			);
		}

		return isDraft ? <span className="draft">{t('draft')}</span> : null;
	}

	renderAttempts() {
		const {
			isSubmitted,
			failed,
			maxSubmissions,
			submissionCount,
		} = this.state;

		if (isSubmitted && !failed) {
			return null;
		}

		let key = 'attempts';

		if (!isSubmitted) {
			key = `${key}.notStarted`;
		} else {
			key = `${key}.started.failed`;
		}

		let label = '';

		if (maxSubmissions == null) {
			label = t(`${key}.limitedAttempts`, { count: 1 });
		} else if (maxSubmissions < 0) {
			label = t(`${key}.unlimitedAttempts`);
		} else {
			label = t(`${key}.limitedAttempts`, {
				count: maxSubmissions - submissionCount,
			});
		}

		return <span className={cx('attempts', { failed })}>{label}</span>;
	}

	renderTimed() {
		const { duration, isSynthetic } = this.state;

		if (isSynthetic) {
			return null;
		}

		return duration ? this.renderDuration() : this.renderMaxTime();
	}

	renderDuration() {
		const { maxTime, duration } = this.state;
		const ontime = duration <= maxTime;
		const cls = cx('duration', { ontime, overtime: !ontime });

		return <span className={cls}>{getNaturalDuration(duration, 2)}</span>;
	}

	renderMaxTime() {
		const { maxTime } = this.state;

		return maxTime ? (
			<span className="max-time">
				{t('maxTime', {
					maxTime: getNaturalDuration(maxTime, 2, true),
				})}
			</span>
		) : null;
	}

	renderCompletion() {
		const {
			completedDate,
			isNoSubmit,
			dueDate,
			maxTime,
			duration,
			failed,
			hasCompletion,
		} = this.state;

		if (!completedDate) {
			return null;
		}

		const late = dueDate && completedDate >= dueDate;
		const qtip = t('completed.submittedAt', {
			date: DateTime.format(completedDate, DateTime.TIME_DATE_STAMP),
		});

		const overtime =
			!isNoSubmit && maxTime && duration && duration > maxTime
				? t('completed.overTimeTip', {
						time: getNaturalDuration(duration - maxTime, 1),
				  })
				: null;
		const overdue =
			late && !isNoSubmit
				? t('completed.overDueTip', {
						time: getNaturalDuration(
							completedDate.getTime() - dueDate.getTime()
						),
				  })
				: null;

		let label = '';

		if (isNoSubmit) {
			label = t('completed.graded');
		} else if (hasCompletion) {
			label = t('completed.label');
		} else {
			label = t('completed.noCompletion');
		}

		return (
			<span
				className={cx('completed', {
					late,
					ontime: !late,
					'submission-failed': failed,
				})}
			>
				<span className="status-label" data-qtip={qtip}>
					{label}
				</span>
				{(overtime != null || overdue != null) && (
					<React.Fragment>
						<span className="mod-open errors">
							{t('completed.modOpen')}
						</span>
						{overtime != null && (
							<span className="errors" data-qtip={overtime}>
								{t('completed.overTime')}
							</span>
						)}
						{overtime != null && overdue != null && (
							<span className="mod-separator errors">
								{t('completed.modSeparator')}
							</span>
						)}
						{overdue != null && (
							<span className="errors" data-qtip={overdue}>
								{t('completed.overDue')}
							</span>
						)}
						<span className="mod-close errors">
							{t('completed.modClose')}
						</span>
					</React.Fragment>
				)}
				<DateTime
					className="date"
					date={completedDate}
					format={DateTime.WEEKDAY_MONTH_NAME_DAY}
				/>
			</span>
		);
	}

	onStatusClick = e => {
		e.preventDefault();
		e.stopPropagation();

		const { onInlineEditorExpanded } = this.props;

		onInlineEditorExpanded && onInlineEditorExpanded();
	};

	renderDue() {
		const {
			completedDate,
			dueDate,
			availableDate,
			now,
			isDraft,
			isNoSubmit,
		} = this.state;
		const { assignment, editMode } = this.props;

		if (completedDate) {
			return null;
		}

		const format = date =>
			DateTime.format(
				date,
				DateTime.WEEKDAY_MONTH_NAME_DAY_TIME_WITH_ZONE
			);

		const dueToday = dueDate > now && isToday(dueDate);
		const late = !isNoSubmit && dueDate && dueDate <= now;

		let text = '';

		if (dueToday) {
			text = t('due.today', {
				time: DateTime.format(dueDate, DateTime.TIME_WITH_ZONE),
			});
		} else if (availableDate > now && dueDate > now) {
			text = t('due.available', { date: format(availableDate) });
		} else if (dueDate) {
			text = t('due.due', { date: format(dueDate) });
		} else if (!isDraft && availableDate < now) {
			text = t('due.availableNow');
		} else if (!isDraft && availableDate) {
			text = t('due.available', { date: format(availableDate) });
		}

		if (editMode && assignment && assignment.getDateEditingLink()) {
			const className = this.props.statusExpanded
				? 'icon-chevron-up'
				: 'icon-chevron-down';

			// render editable widget
			return !text ? null : (
				<span
					className={cx('due', 'editable', { today: dueToday, late })}
					onClick={this.onStatusClick}
				>
					<span className="label">{text}</span>
					<i className={className} />
				</span>
			);
		}

		return !text ? null : (
			<span className={cx('due', { today: dueToday, late })}>{text}</span>
		);
	}

	renderRequired() {
		const { required, onRequirementChange, overviewItemRef } = this.props;

		if (
			overviewItemRef &&
			overviewItemRef.isCompletable &&
			overviewItemRef.isCompletable() &&
			onRequirementChange
		) {
			return (
				<RequirementControl
					record={overviewItemRef}
					onChange={onRequirementChange}
				/>
			);
		}

		return required && <Required />;
	}

	renderExcused() {
		const { isExcused } = this.state;

		return !isExcused ? null : (
			<span className="excused" data-qtip={t('excused.tip')}>
				{t('excused.label')}
			</span>
		);
	}
}
