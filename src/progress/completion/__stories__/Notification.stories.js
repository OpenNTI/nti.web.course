import EventEmitter from 'events';

import React, { useEffect } from 'react';

import Notification from '../Notification';

export default {
	title: 'Completion Notification',
	component: Notification,
};

const course = {

	PreferredAccess: Object.assign(new EventEmitter(), {
		AcknowledgeCompletion: true,
		hasLink (rel) {
			return this[rel];
		},
		deleteLink (rel) {
			delete this[rel];
			this.emit('change');
		}

	})
};


export const Example = () => {
	useEffect(() => () => course.PreferredAccess.AcknowledgeCompletion = true);
	return (
		<Notification course={course} viewCertificateAction={{href: 'https://google.com', target: '_blank'}}/>
	);
};

export const ExampleWithoutCertificate = () => {
	useEffect(() => () => course.PreferredAccess.AcknowledgeCompletion = true);
	return (
		<Notification course={course} />
	);
};
