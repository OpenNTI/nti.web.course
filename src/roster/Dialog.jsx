import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from '@nti/web-commons';

export default class Dialog extends React.Component {
	static propTypes = {
		content: PropTypes.any, // renderable
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	close = () => {
		const { router } = this.context;

		if (router && router.routeTo && router.routeTo.name) {
			router.routeTo.name('course-roster-list');
		}
	};

	render() {
		const { content: Content, ...props } = this.props;
		return (
			<Prompt.Dialog onBeforeDismiss={this.close}>
				<Content {...props} />
			</Prompt.Dialog>
		);
	}
}
