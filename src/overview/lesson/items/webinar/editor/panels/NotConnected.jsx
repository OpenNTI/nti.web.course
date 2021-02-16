import React from 'react';
// import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Loading } from '@nti/web-commons';

const t = scoped(
	'course.overview.lesson.items.webinar.editor.panels.NotConnected',
	{
		title: 'A GoToWebinar Account is Not Connected Yet.',
		description:
			'Connecting a GoToWebinar account will allow authors to add webinars to any course.  Managing integrations can be found in the Site Administration view.',
		connect: 'Connect',
	}
);

export default class WebinarNotConnected extends React.Component {
	static propTypes = {};

	state = {};

	async componentDidMount() {
		this.setState({ loading: true });

		const service = await getService();

		if (service.getWorkspace('SiteAdmin')) {
			this.setState({ isSiteAdmin: true, loading: false });
		}
	}

	onConnect = () => {
		// open integrations form?
	};

	render() {
		if (this.state.loading) {
			return (
				<div className="webinar-not-connected">
					<Loading.Ellipsis />
				</div>
			);
		}

		return (
			<div className="webinar-not-connected">
				<div className="icon" />
				<div className="title">{t('title')}</div>
				<div className="description">{t('description')}</div>
				{this.state.isSiteAdmin && (
					<div onClick={this.onConnect} className="connect-button">
						{t('connect')}
					</div>
				)}
			</div>
		);
	}
}
