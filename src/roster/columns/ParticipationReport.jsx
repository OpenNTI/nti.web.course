import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Prompt } from '@nti/web-commons';
import { Viewer as ReportViewer } from '@nti/web-reports';

import styles from './ParticipationReport.css';

const cx = classnames.bind(styles);

export default class ParticipationReport extends React.Component {
	static cssClassName = cx('participation-report-cell');

	static propTypes = {
		item: PropTypes.object,
	};

	state = {};

	showReport = e => {
		if (e && e.stopPropagation) {
			e.stopPropagation(); // suppress row click behavior
		}

		const [report] = this.getReports();

		if (report) {
			this.setState({ report });
		}
	};

	hideReport = () => {
		this.setState({ report: undefined });
	};

	getReports = () => {
		const { item: { reports } = {} } = this.props;
		return reports;
	};

	render() {
		const { report } = this.state;

		return (this.getReports() || []).length === 0 ? null : (
			<>
				<div
					className={cx('participation-report')}
					onClick={this.showReport}
				>
					<i className={cx('icon-report')} />
				</div>
				{report && (
					<Prompt.Dialog onBeforeDismiss={this.hideReport}>
						<ReportViewer report={report} />
					</Prompt.Dialog>
				)}
			</>
		);
	}
}
