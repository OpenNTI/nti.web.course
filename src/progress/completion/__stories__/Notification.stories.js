import EventEmitter from 'events';

import React, { useMemo } from 'react';

import Notification from '../Notification.jsx';

const Template = ({ show, certificate }) => {
	const course = useMemo(
		() => ({
			PreferredAccess: Object.assign(new EventEmitter(), {
				hasCompletionAcknowledgmentRequest: show,
				AcknowledgeCompletion: true,
				acknowledgeCourseCompletion() {
					this.hasCompletionAcknowledgmentRequest = false;
					this.emit('change');
				},
			}),
		}),
		[show]
	);

	const certTarget = !certificate
		? null
		: { href: certificate, target: '_blank' };

	return !show ? (
		<></>
	) : (
		<Notification course={course} viewCertificateAction={certTarget} />
	);
};

export const Example = Template.bind({});
Example.args = {
	certificate: '#/certificate.pdf',
	show: true,
};

export default {
	title: 'Completion Notification',
	component: Notification,
};
