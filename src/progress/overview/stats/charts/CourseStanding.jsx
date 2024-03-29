import './CourseStanding.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Loading, DisplayName } from '@nti/web-commons';

import { formatProgressStats } from './utils';

const t = scoped('course.progress.overview.stats.charts.CourseStanding', {
	label: 'Course Standing',
	progressBinLabel: '%(start)s - %(end)s%%',
	progressPercentLabel: ' - %(percent)s%%',
	error: 'Unable to load progress statistics.',
});

export default class CourseStanding extends React.Component {
	static label = t('label');

	static propTypes = {
		course: PropTypes.object.isRequired,
		enrollment: PropTypes.object,
		large: PropTypes.bool,
	};

	state = {};

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const {
			course: oldCourse,
			enrollment: oldEnrollment,
			large: oldLarge,
		} = prevProps;
		const {
			course: newCourse,
			enrollment: newEnrollment,
			large: newLarge,
		} = this.props;

		if (
			oldCourse !== newCourse ||
			oldEnrollment !== newEnrollment ||
			oldLarge !== newLarge
		) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		this.setState(
			{
				loading: true,
				error: null,
			},
			async () => {
				const { course, enrollment, large } = props;

				try {
					const stats = await course.fetchLink({
						mode: 'raw',
						rel: 'ProgressStats',
					});

					this.setState({
						loading: false,
						stats: formatProgressStats(stats, large, enrollment),
					});
				} catch (e) {
					this.setState({
						loading: false,
						error: e,
					});
				}
			}
		);
	}

	render() {
		const { loading, error, stats } = this.state;

		return (
			<div className="progress-overview-charts-course-standing">
				{loading && (
					<div className="loading-mask">
						<Loading.Spinner />
					</div>
				)}
				{!loading && error && (
					<div className="error-container">
						<div className="error">{t('error')}</div>
					</div>
				)}
				{!loading && stats && (
					<div className="chart-container">
						<div className="chart">
							<div className="grid-lines">
								<div className="line first" />
								<div className="line second" />
								<div className="line third" />
								<div className="line fourth" />
								<div className="line fifth" />
							</div>
							<div className="series-container">
								{this.renderStats(stats)}
							</div>
							{this.renderEnrollmentProgress()}
						</div>
					</div>
				)}
			</div>
		);
	}

	renderStats(stats) {
		const { series, upperBound } = stats;

		return (
			<div className="series">
				{series.map((data, index) => {
					const percentTotal = Math.round(
						(data.total / upperBound) * 100
					);
					const startingPercent = Math.floor(data.start * 100);
					const endingPercent = Math.ceil(data.end * 100);

					const style = {
						left: `${startingPercent}%`,
						width: `${endingPercent - startingPercent}%`,
						top: percentTotal ? `${100 - percentTotal}%` : 'auto',
					};

					return (
						<div
							className={cx('data', {
								empty: percentTotal === 0,
							})}
							key={index}
							style={style}
						>
							<div className="fill" />
							<div className="label">
								{t('progressBinLabel', {
									start: startingPercent,
									end: endingPercent,
								})}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	renderEnrollmentProgress() {
		const { enrollment } = this.props;

		if (!enrollment) {
			return null;
		}

		const { CourseProgress, UserProfile, Username } = enrollment;
		const { PercentageProgress } = CourseProgress;
		const percent = Math.floor(PercentageProgress * 100);
		const style = {
			left: `${percent}%`,
		};

		return (
			<div
				className={cx('enrollment-progress', { left: percent > 50 })}
				style={style}
			>
				<div className="label">
					<DisplayName entity={UserProfile || Username} />
					<span>{t('progressPercentLabel', { percent })}</span>
				</div>
			</div>
		);
	}
}
