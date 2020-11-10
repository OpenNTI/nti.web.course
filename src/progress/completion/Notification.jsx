import React, { useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import {Prompt, Hooks} from '@nti/web-commons';

import {
	Frame,
	CertificateIcon,
	Heading,
	Description,
	ViewCertificate,
} from './notification-parts';

const Receiver = ({children: renderer, ...props}) => renderer(props);

Notification.propTypes = {
	course: PropTypes.shape({
		PreferredAccess: PropTypes.shape({
			acknowledgeCourseCompletion: PropTypes.func,
			hasCompletionAcknowledgmentRequest: PropTypes.bool,
		})
	}),
	viewCertificateAction: PropTypes.shape({
		href: PropTypes.string,
		onClick: PropTypes.func
	})
};

export default function Notification ({course, viewCertificateAction: viewCertificate}) {
	const {PreferredAccess: enrollment} = course || {};
	Hooks.useChanges(enrollment);

	const [hide, trip] = useReducer(() => true, false);

	const acknowledge = useCallback(() => {
		enrollment.acknowledgeCourseCompletion();
		trip();
	}, [enrollment]);

	const isComplete = enrollment?.hasCompletionAcknowledgmentRequest;

	return !isComplete || hide ? null : (
		<Prompt.Dialog onBeforeDismiss={acknowledge} closeOnMaskClick={false}>
			<Receiver>
				{({onDismiss}) => (
					<Frame onDismiss={onDismiss}>

						<CertificateIcon/>

						{viewCertificate && <ViewCertificate {...viewCertificate} />}

						<Heading />
						<Description/>

					</Frame>
				)}
			</Receiver>
		</Prompt.Dialog>
	);
}
