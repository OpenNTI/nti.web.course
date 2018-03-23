import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {List, DateTime} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	draft: 'Draft',
	maxTime: '%(maxTime)s time limit',
	completed: {
		label: 'completed ',
		graded: 'graded ',
		submittedAt: 'Submitted At %(date)s',
		overTime: 'overtime',
		overDue: 'overdue',
		overTimeTip: '%(time)s overtime',
		overDueTip: '%(time)s overdue',
		modOpen: '(',
		modClose: ') ',
		modSeparator: ', '
	},
	due: {
		today: 'Due Today at %(time)s',
		due: 'Due %(date)s',
		availableNow: 'Available Now',
		available: 'Available %(date)s'
	},
	excused: {
		label: 'Excused Grade',
		tip: 'This assignment will NOT count towards your grade'
	},
	required: 'Required'
};
const t = scoped('course.overview.lesson.overview.question-set.AssignmentLabel', DEFAULT_TEXT);

const getNaturalDuration = (...args) => DateTime.getNaturalDuration(...args);
const formatDate = (...args) => DateTime.format(...args);
const isToday = (...args) => DateTime.isToday(...args);

export default class LessonOverviewAssignmentLabel extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		assignmentHistory: PropTypes.object,
		required: PropTypes.bool
	}

	state = {}

	componentWillReceiveProps (nextProps) {
		const {assignment:newAssignment, assignmentHistory:newHistory} = nextProps;
		const {assignment:oldAssignment, assignmentHistory:oldHistory} = this.props;

		if (newAssignment !== oldAssignment || newHistory !== oldHistory) {
			this.setupFor(nextProps);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props = this.props) {
		const {assignment: a, assignmentHistory: h} = props;
		const canEdit = a.hasLink('date-edit') || a.hasLink('edit');

		const state = {
			now: new Date(),
			availableDate: a && a.getAssignedDate(),
			dueDate: a && a.getDueDate(),
			isNoSubmit: (a && a.isNonSubmit()) || (h && h.isSyntheticSubmission()),
			isSynthetic: h && h.isSyntheticSubmission(),
			isDraft: a && !a.isPublished(),
			isTimed: a && a.isTimed,
			maxTime: a && a.isTimed && a.getMaximumTimeAllowed && a.getMaximumTimeAllowed(),
			duration: a && a.isTimed && a.getDuration && a.getDuration(),

			isSubmitted: h && h.isSubmitted(),
			completedDate: !canEdit && h && h.Submission && h.Submission.getCreatedTime(),
			isExcused: h && h.grade && h.grade.isExcused()

		};

		this.setState(state);
	}



	render () {
		return (
			<List.SeparatedInline className="lesson-overview-assignment-status">
				{this.renderDraft()}
				{this.renderTimed()}
				{this.renderCompletion()}
				{this.renderRequired()}
				{this.renderDue()}
				{this.renderExcused()}
			</List.SeparatedInline>
		);
	}


	renderDraft () {
		const {isDraft} = this.state;

		return isDraft ?
			(<span className="draft">{t('draft')}</span>) :
			null;
	}


	renderTimed () {
		const {duration, isSynthetic} = this.state;

		if (isSynthetic) { return null; }

		return duration ?
			this.renderDuration() :
			this.renderMaxTime();
	}

	renderDuration () {
		const {maxTime, duration} = this.state;
		const ontime = duration <= maxTime;
		const cls = cx('duration', {ontime, overtime: !ontime});

		return (
			<span className={cls}>{getNaturalDuration(duration, 2)}</span>
		);
	}

	renderMaxTime () {
		const {maxTime} = this.state;

		return maxTime ?
			(<span className="max-time">{t('maxTime', {maxTime: getNaturalDuration(maxTime, 2, true)})}</span>) :
			null;
	}


	renderCompletion () {
		const {completedDate, isNoSubmit, dueDate, maxTime, duration} = this.state;

		if (!completedDate) { return null; }

		const late = dueDate && completedDate >= dueDate;
		const qtip = t('completed.submittedAt', {date: formatDate(completedDate, 'h:mm A M/D/YYYY')});

		const overtime = maxTime && duration && duration > maxTime ? t('completed.overTimeTip', {time: getNaturalDuration(duration - maxTime, 1)}) : null;
		const overdue = late ? t('completed.overDueTip', {time: getNaturalDuration(completedDate.getTime() - dueDate.getTime())}) : null;

		return (
			<span className={cx('completed', {late, ontime: !late})}>
				<span className="label" data-qtip={qtip}>{isNoSubmit ? t('completed.graded') : t('completed.label')}</span>
				{(overtime != null || overdue != null) && (
					<React.Fragment>
						<span className="mod-open errors">{t('completed.modOpen')}</span>
						{overtime != null && (<span className="errors" data-qtip={overtime}>{t('completed.overTime')}</span>)}
						{overtime != null && overdue != null && (<span className="mod-separator errors">{t('completed.modSeparator')}</span>)}
						{overdue != null && (<span className="errors" data-qtip={overdue}>{t('completed.overDue')}</span>)}
						<span className="mod-close erros">{t('completed.modClose')}</span>
					</React.Fragment>
				)}
				<DateTime className="date" date={completedDate} format="dddd, MMMM D" />
			</span>
		);
	}


	renderDue () {
		const {completedDate, dueDate, availableDate, now, isDraft, isNoSubmit} = this.state;

		if (completedDate) { return null; }

		const format = date => formatDate(date, 'dddd, MMMM D h:mm A z');

		const dueToday = dueDate > now && isToday(dueDate);
		const late = !isNoSubmit && dueDate && dueDate <= now;

		let text = '';

		if (dueToday) {
			text = t('due.today', {time: formatDate(dueDate, 'h:m a z')});
		} else if (availableDate > now && dueDate > now) {
			text = t('due.available', {date: format(availableDate)});
		} else if (dueDate) {
			text = t('due.due', {date: format(dueDate)});
		} else if (availableDate < now) {
			text = t('due.availableNow');
		} else if (!isDraft && availableDate) {
			text = t('due.available', {date: format(availableDate)});
		}

		return !text ? null : (
			<span className={cx('due', {today: dueToday, late})}>
				{text}
			</span>
		);
	}


	renderRequired () {
		const {required} = this.props;

		return required && (<div className="required">{t('required')}</div>);
	}


	renderExcused () {
		const {isExcused} = this.state;

		return !isExcused ?
			null :
			(<span className="excused" data-qtip={t('excused.tip')}>{t('excused.label')}</span>);
	}
}
