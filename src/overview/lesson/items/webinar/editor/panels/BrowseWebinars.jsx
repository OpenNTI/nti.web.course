import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {GotoWebinar} from '@nti/web-integrations';
import {getHistory} from '@nti/web-routing';

const t = scoped('course.overview.lesson.items.webinar.editor.panels.BrowseWebinars', {
	webinarLinkDesc: 'Do you have a GoToWebinar link?',
	pasteLink: 'Paste Link'
});

export default class BrowseWebinars extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onLinkClick: PropTypes.func,
		onWebinarClick: PropTypes.func
	}

	state = {}

	static childContextTypes = {
		router: PropTypes.object
	}


	getChildContext () {
		const {router: providedRouter} = this.context;

		return {
			router: {
				...providedRouter,
				history: getHistory(),
				getRouteFor: (obj) => {
					return () => {
						const {onWebinarClick} = this.props;

						if(onWebinarClick) {
							onWebinarClick(obj);
						}
					};
				}
			}
		};
	}

	render () {
		return (
			<div className="webinar-browse-webinars">
				<div className="link-bar">
					<span>{t('webinarLinkDesc')}</span>
					<span className="go-to-link" onClick={() => {
						if(this.props.onLinkClick) {
							this.props.onLinkClick();
						}
					}}>{t('pasteLink')}</span>
				</div>
				<GotoWebinar.UpcomingWebinars context={this.props.course}/>
			</div>
		);
	}
}
